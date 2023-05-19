import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import contentController from '../controllers/contentController';


function ContentRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get('/content/:id', contentController.getContentDetails);
    next();
}

export default fp(ContentRoutes);