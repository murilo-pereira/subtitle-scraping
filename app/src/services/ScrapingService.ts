import {RabbitAdapter} from "../libraries/queue/RabbitAdapter";
import * as puppeteer from 'puppeteer';
import {Config} from "../libraries/config/Config";
import {LegendasTV} from "../domain/scraping/LegendasTV";
import {Subtitle} from "../domain/queue/subtitles/Subtitle";

export class ScrapingService {

    private rabbitAdapter: RabbitAdapter;

    constructor(rabbitAdapter: RabbitAdapter) {
        this.rabbitAdapter = rabbitAdapter;
    };

    public async scraping() {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        const page = await browser.newPage();

        const config = Config.getConfig();

        await page.goto(LegendasTV.LOGIN_URL);

        const login = config.scraping.legendastv.username;
        const password = config.scraping.legendastv.password;

        await page.waitForSelector('#UserUsername');
        await page.type('#UserUsername', login);
        await page.waitForSelector('#UserPassword');
        await page.type('#UserPassword', password);

        await Promise.all([
            page.waitForNavigation(),
            page.click('#UserLoginForm > button')
        ]);

        await page.goto(`${LegendasTV.SEARCH_URL}/${config.scraping.legendastv.searchTerm}`);

        const results = await page.evaluate(() => {
            const subtitlesList = Array.from(document.querySelectorAll('.gallery > article > div'));

            const subtitles = [];

            subtitlesList.map((item) => {
                const name = item.querySelector('p > a').textContent;

                const itemData = item.querySelector('.data');

                const downloads = itemData.textContent.split(' ')[0];

                const note = itemData.textContent.split('nota ')[1].split(',')[0];

                const senderName = item.querySelector('.data > a').textContent;

                const date = itemData.textContent.split('em ')[1];

                const language = item.querySelector('img').getAttribute('title');

                const link = item.querySelector('p > a').getAttribute('href');
                const directLink = link.replace(/download/g, '$&arquivo');

                let subtitle = {
                    name: name,
                    downloads: downloads,
                    note: note,
                    senderName: senderName,
                    date: date,
                    language: language,
                    directLink: directLink,
                    link: link
                };

                subtitles.push(subtitle);
            });

            return subtitles
        });

        await results.forEach(async (item) => {
            await this.sendQueue(item);
        });

        await browser.close();
    }

    private sendQueue(data) {
        this.rabbitAdapter.publish(JSON.stringify(data), Subtitle.SUBTITLE_QUEUE).catch((err) => {
            console.log(err);
        });
    }
}