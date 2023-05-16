import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import trendingController from '../controllers/trendingController';


function TrendingRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get('/trending', trendingController.topTen);
    next();
}

export default fp(TrendingRoutes);