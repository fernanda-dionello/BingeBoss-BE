import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyPluginAsync 
} from 'fastify';
import fp from 'fastify-plugin';
import { Db } from '../config/index';
import { UserAttrs } from '../models/userModel';
import crypto from 'crypto';

// Declaration merging
declare module 'fastify' {
    export interface FastifyInstance {
        db: Db;
    }
}

interface userParams {
    id: string;
}

const UsersRoute: FastifyPluginAsync = async (server: FastifyInstance, options: FastifyPluginOptions) => {

    server.get('/users', {}, async (request, reply) => {
        try {
            const { User } = server.db.models;
            const users = await User.find({});
            return reply.code(200).send(users);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });

    server.post<{ Body: UserAttrs }>('/users', {}, async (request, reply) => {
        try {
            const { User } = server.db.models;
            
            const encryptPassword = crypto.createHash('sha1');
            encryptPassword.update(request.body.password);
            request.body.password = encryptPassword.digest('hex');

            const user = await User.addOne(request.body);
            await user.save();
            
            return reply.code(201).send(user);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });
 
    server.get<{ Params: userParams }>('/users/:id', {}, async (request, reply) => {
        try {
            const ID = request.params.id;
            const { User } = server.db.models;
            const user = await User.findById(ID);
            if (!user) {
                return reply.send(404);
            }
            return reply.code(200).send(user);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });
};
export default fp(UsersRoute);