import {RabbitAdapter} from "../libraries/queue/RabbitAdapter";
import {SubtitlesRepository} from "../repositories/SubtitlesRepository";
import {Channel, Message} from "amqplib";
import {Subtitle} from "../domain/queue/subtitles/Subtitle";
import {LegendasTV} from "../domain/scraping/LegendasTV";
import * as moment from "moment";
import {Browser} from "puppeteer";

export class ScrapingConsumer {

    private rabbitAdapter: RabbitAdapter;

    private subtitlesRepository: SubtitlesRepository;

    private browser: Browser;

    constructor(rabbitAdapter: RabbitAdapter, subtitlesRepository: SubtitlesRepository, browser: Browser) {
        this.rabbitAdapter = rabbitAdapter;

        this.subtitlesRepository = subtitlesRepository;

        this.browser = browser;

        this.processMessage = this.processMessage.bind(this);
    };

    public async consume() {
        await this.rabbitAdapter.consume(Subtitle.SUBTITLE_QUEUE, this.processMessage)
    }

    private async processMessage(message: Message, channel: Channel) {
        let subtitleObj = JSON.parse(message.content.toString());

        let persist = await this.scrapingAndPersist(subtitleObj);

        if (persist) {
            return channel.ack(message, false);
        }

        return channel.nack(message, false, true);
    }

    public async scrapingAndPersist(subtitleObj: any) {
        const page = await this.browser.newPage();

        await page.goto(`${LegendasTV.BASE_URL}${subtitleObj.link}`, {
            waitUntil: 'load',
            timeout: 0
        });

        subtitleObj.ratio = await page.evaluate(() => {
            const item = document.querySelector('.middle');

            const like = Number(item.querySelectorAll('p')[3].textContent);

            let dislike = Number(item.querySelectorAll('p')[4].textContent);

            if (dislike === 0) {
                dislike = 1;
            }

            return parseFloat((like / dislike).toFixed(2));
        });

        await page.close();

        subtitleObj.date = subtitleObj.date.split(' - ')[0];
        subtitleObj.date = moment(subtitleObj.date, 'DD-MM-YYYY').format('YYYY-MM-DD').toString();

        return await this.persistence(subtitleObj);
    }

    private async persistence(subtitle: object): Promise<boolean> {
        return this.subtitlesRepository.create(subtitle).then(() => {
            return true;
        }).catch((error) => {
            console.log(error);
            return false;
        });
    }
}