import * as path from "path";

export class Config {
    public static getConfig() {
        return require(path.resolve(`${__dirname}./../../config/config.json`));
    }
}