import {Channel, connect, Connection, Message} from "amqplib";
import {Config} from "../config/Config";

export class RabbitAdapter {

    private static connection;

    private async getConnection(): Promise<Connection> {
        if (!RabbitAdapter.connection) {
            await this.connect();
        }

        return RabbitAdapter.connection;
    }

    private async connect() {
        const config = Config.getConfig();

        const rabbitServer = `amqp://${config.rabbitmq.host}:${config.rabbitmq.port}`;

        await connect(rabbitServer).then((conn) => {
            RabbitAdapter.connection = conn;
        }).catch((err) => {
            console.log(err);
        })
    }

    public async publish(message, queueName) {
        const connection = await this.getConnection();

        connection.createChannel().then((channel) => {
            channel.assertQueue(queueName, {durable: true}).then((queue) => {
                const options = {
                    persistent: true,
                    noAck: false,
                    timestamp: Date.now(),
                    contentEncoding: "utf-8",
                    contentType: "text/plain"
                };


                channel.publish('', queue.queue, Buffer.from(message), options);

                channel.close().thenReturn();
            });
        })
    }

    public async consume(queueName: string, callback: (msg: Message, channel: Channel) => any) {
        const connection = await this.getConnection();

        connection.createChannel().then((channel) => {
            channel.assertQueue(queueName, {durable: true}).then((queue) => {
                channel.consume(queue.queue, function (message) {
                    callback(message, channel);
                }, {noAck: false}).thenReturn();
            });
        });
    }
}