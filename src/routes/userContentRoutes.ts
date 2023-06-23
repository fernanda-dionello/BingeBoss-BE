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
    fastify.get('/userContent/:id', userContentController.getContentStatus);
    fastify.get('/userContent/status/:status', userContentController.getContentByStatus);
    fastify.post('/userContent/:id/rating/:rate', userContentController.setContentRating);
    fastify.get('/userContent/:id/rating', userContentController.getContentRating);
    fastify.get('/userContent/consumption', userContentController.getContentConsumption);
    fastify.get('/userContent/recommendation', userContentController.getContentRecommendation);
    next();
}

export default fp(UserContentRoutes);