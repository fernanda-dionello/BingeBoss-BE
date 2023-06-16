import { 
  FastifyReply
} from 'fastify';
import searchServices from '../services/searchServices';
import mongoose from 'mongoose';

export type ContentType = 'multi' | 'movie' | 'person' | 'tv'; 

export interface searchQuery {
  title: string;
  adult?: boolean;
  language?: string;
  page?: number;
  type: ContentType;
  genre?: string;
}

export default {
  async search(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as searchQuery;
      const result = await searchServices.search(queryParams);   
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Content not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },
}