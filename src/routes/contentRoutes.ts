import { 
  FastifyInstance, 
  FastifyPluginOptions, 
  FastifyError
} from 'fastify';
import fp from 'fastify-plugin';
import contentController from '../controllers/contentController';
import { ContentCommentAttrs } from '../models/contentCommentModel';


function ContentRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    next: (err?: FastifyError) => void
){
    fastify.get('/content/:id', contentController.getContentDetails);
    fastify.post<{ Body: ContentCommentAttrs }>('/content/:id/comment', contentController.setContentComment);
    fastify.get('/content/:id/comments', contentController.getContentComments);
    next();
}

export default fp(ContentRoutes);