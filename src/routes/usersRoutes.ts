import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import usersController from '../controllers/usersController';
import { UserAttrs, UserParams } from '../models/usersModel';

function UsersRoute(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get('/users', usersController.showAll);
    fastify.get<{ Params: UserParams }>('/users/:id', usersController.showById);
    fastify.post<{ Body: UserAttrs }>('/users', usersController.create);
    next();
}

export default fp(UsersRoute);