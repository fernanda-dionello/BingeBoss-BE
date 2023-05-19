import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import userContentController from '../controllers/userContentController';

function UserContentRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.post('/userContent/:id', userContentController.setContentStatus);
    next();
}

export default fp(UserContentRoutes);