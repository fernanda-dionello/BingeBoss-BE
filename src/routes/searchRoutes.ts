import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import searchController from '../controllers/searchController';
import { UserAttrs } from '../models/usersModel';


function SearchRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get<{ Body: UserAttrs }>('/search', searchController.search);
    next();
}

export default fp(SearchRoutes);