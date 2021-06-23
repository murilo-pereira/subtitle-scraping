import * as mongoose from 'mongoose';
import {Config} from "../libraries/config/Config";

export abstract class BaseModel {

    protected constructor() {
        this.connect(Config.getConfig());
    }

    private connect(config) {
        if (!mongoose.connection.readyState) {

            const connectionString = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;

            mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}

export {mongoose};