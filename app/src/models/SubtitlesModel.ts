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


//         ◦ Nome: string
// ◦ Quantidade de downloads: int
// ◦ Nota da legenda: int
// ◦ “Like ratio” (razão entre likes e dislikes): float, duas casas decimais
// ◦ Nome de quem enviou: string
// ◦ Data que foi enviada: date
// ◦ Idioma da legenda: string
// ◦ Link de download direto: string


// {
//     name: name,
//         downloads: downloads,
//         note: '',
//         ratio: ratio,
//         senderName: senderName,
//         date: date,
//         language: language,
//         directLink: '',
// };