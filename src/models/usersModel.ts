import { Document, Model } from 'mongoose';
import mongoose from 'mongoose';

export interface UserAttrs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UpdateUserAttrs {
    firstName: string;
    lastName: string;
    email: string;
    oldPassword?: string;
    newPassword?: string;
    confirmedPassword?: string;
}

export interface UserParams {
    id: string;
}

export interface UserSpoilerProtectionParams {
    id: string;
    isEnabled: string;
}

export interface UserLoginAttrs {
    email: string;
    password: string;
}

export interface UserAttrsResult extends Document{
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  spoilerProtection: boolean;
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
    spoilerProtection: boolean;
}

const userSchema = new mongoose.Schema(    {
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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: true
    },
    spoilerProtection: {
        type: Boolean,
        required: true
    },
},
{
    timestamps: true
});

// export const User = model<UserDocument, UserModel>('User', userSchema);
export default mongoose.model('User', userSchema);