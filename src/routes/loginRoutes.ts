import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import loginController from '../controllers/loginController';
import { UserAttrs } from '../models/usersModel';

function LoginRoute(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.post<{ Body: UserAttrs }>('/login', loginController.login);
    next();
}

export default fp(LoginRoute);