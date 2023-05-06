import { Schema, Document, model, Model } from 'mongoose';
export interface UserAttrs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface UserAttrsResult extends Document{
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface UserModel extends Model<UserDocument> {
    addOne(doc: UserAttrs): UserDocument;
}

export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}
export const userSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.statics.addOne = (doc: UserAttrs) => {
    return new User(doc);
};
export const User = model<UserDocument, UserModel>('User', userSchema);