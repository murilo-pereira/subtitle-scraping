import {ScrapingService} from "../services/ScrapingService";
import {RabbitAdapter} from "../libraries/queue/RabbitAdapter";

const scrapingService = new ScrapingService(new RabbitAdapter());

scrapingService.scraping().then();