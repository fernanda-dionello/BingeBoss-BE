import { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

export interface UserContentAttrs {
    userId: string;
    contentId: string;
    contentType: string;
    contentStatus: string;
}

export interface UserContentModel extends Model<UserContentDocument> {
    addOne(doc: UserContentAttrs): UserContentDocument;
}

export interface UserContentDocument extends Document {
    userId: string;
    contentId: string;
    contentType: string;
    contentStatus: string;
}

const userContentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    contentId: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    contentStatus: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
});

userContentSchema.index(
    { userId: 1, contentId: 1, contentType: 1 },
    { unique: true }
);

export default mongoose.model('UserContent', userContentSchema);