import { 
  FastifyReply
} from 'fastify';
import mongoose from 'mongoose';
import contentService from '../services/contentService';
import { AxiosError } from 'axios';

export type ContentType = 'movie' | 'tv'; 

export interface contentDetailsQuery {
  language?: string;
  type: ContentType;
}

export default {
  async getContentDetails(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as contentDetailsQuery;
      const { id } = request.params;
      const result = await contentService.getContentDetails(queryParams, id);
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      if (err instanceof AxiosError) {
        if (err.code == 'ERR_BAD_REQUEST') {
          return reply.code(400).send("Bad request.");
        }
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },
}