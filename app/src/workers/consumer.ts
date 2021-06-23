import {ScrapingConsumer} from "../services/ScrapingConsumer";
import {RabbitAdapter} from "../libraries/queue/RabbitAdapter";
import {SubtitlesRepository} from "../repositories/SubtitlesRepository";
import {SubtitlesModel} from "../models/SubtitlesModel";
import * as puppeteer from "puppeteer";

async function consume() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });

    const scrapingConsumer = new ScrapingConsumer(new RabbitAdapter(), new SubtitlesRepository(new SubtitlesModel()), browser);

    return scrapingConsumer.consume();
}

consume().then();