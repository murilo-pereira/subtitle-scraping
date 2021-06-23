import {BaseModel, mongoose} from './BaseModel'
import {Schema} from 'mongoose';

export class SubtitlesModel extends BaseModel {

    private collectionName: string = 'subtitles';

    constructor() {
        super();
    }

    public async getModel() {
        return await mongoose.model<ISubtitles>(this.collectionName, SubtitlesSchema, this.collectionName);
    }
}

interface ISubtitles extends mongoose.Document {
    name: String,
    downloads: Number,
    note: Number,
    ratio: Number,
    senderName: String,
    date: Date,
    language: String,
    directLink: String
}

const SubtitlesSchema = new Schema({
    name: String,
    downloads: Number,
    note: Number,
    ratio: Number,
    senderName: String,
    date: Date,
    language: String,
    directLink: String
}, {
    versionKey: false
});