import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import usersController from '../controllers/usersController';
import { UserParams } from '../models/usersModel';

function UsersRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get<{ Params: UserParams }>('/users/:id', usersController.showById);
    fastify.put<{ Params: UserParams }>('/users/:id', usersController.updateById);
    fastify.delete<{ Params: UserParams }>('/users/:id', usersController.deleteById);
    fastify.put('/users/:id/spoiler/:isEnabled', usersController.setSpoilerProtection);
    next();
}

export default fp(UsersRoutes);