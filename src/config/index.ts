import { FastifyInstance } from 'fastify';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import mongoose, { ConnectOptions } from 'mongoose';
import { UserModel } from '../models/usersModel';
import dotenv from "dotenv";
dotenv.config();

export interface Models {
    User: UserModel;
}
export interface Db {
    models: Models;
}

// define options
export interface MyPluginOptions {
    uri: string;
}
const ConnectDB: FastifyPluginAsync<MyPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {
    const MONGODB_URI = process.env.MONGODB_URI;
    mongoose
    .connect(MONGODB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => fastify.log.info('MongoDB connected...'))
    .catch(err => fastify.log.error(err));
};
export default fp(ConnectDB);