import { 
  FastifyReply
} from 'fastify';
import trendingServices from '../services/trendingServices';
import mongoose from 'mongoose';

export type ContentType = 'all' | 'movie' | 'person' | 'tv'; 

export interface topTenQuery {
  language?: string;
  type?: ContentType;
}

export default {
  async topTen(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as topTenQuery;
      const result = await trendingServices.topTen(queryParams);
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },
}