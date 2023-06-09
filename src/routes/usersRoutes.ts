import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import usersController from '../controllers/usersController';
import { UserAttrs } from '../models/usersModel';

function UsersRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get('/users', usersController.showAll);
    fastify.post<{ Body: UserAttrs }>('/users', usersController.create);
    next();
}

export default fp(UsersRoutes);