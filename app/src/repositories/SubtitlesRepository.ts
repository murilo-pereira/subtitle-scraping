import {SubtitlesModel} from "../models/SubtitlesModel";

export class SubtitlesRepository {

    private model: SubtitlesModel;

    constructor(subtitlesModel: SubtitlesModel) {
        this.model = subtitlesModel;
    }

    public async create(subtitle: object) {
        let model = await this.model.getModel();

        return model.create(subtitle).then((success) => {
            return success;
        }).catch((err) => {
            return err;
        });
    }
}