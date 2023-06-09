import { 
  FastifyReply
} from 'fastify';
import userContentServices from '../services/userContentServices';
import mongoose from 'mongoose';

export type ContentType = 'movie' | 'tv' | 'season' | 'episode'; 
export type ContentStatus = 'watched' | 'abandoned' | 'watching' | 'myList';

export type ContentRatingType = 'movie' | 'tv';

export interface setContentStatusQuery {
  status: ContentStatus;
  type: ContentType;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface getContentStatusQuery {
  type: ContentType;
  seasonNumber?: number;
  episodeNumber?: number;
}

export interface setContentRatingQuery {
  type: ContentRatingType;
}

export default {
  async setContentStatus(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as setContentStatusQuery;
      const { id: contentId } = request.params;
      const { id: userId } = request.user;
      const result = await userContentServices.setContentStatus({queryParams, contentId, userId});
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      if (err.code === 11000) {
        return reply.code(409).send("User content already exists.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getContentStatus(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as setContentStatusQuery;
      const { id: contentId } = request.params;
      const { id: userId } = request.user;
      const result = await userContentServices.getContentStatus({queryParams, contentId, userId});
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getContentByStatus(request: any, reply: FastifyReply){
    try {
      const { id: userId } = request.user;
      const { status }   = request.params;
      const result = await userContentServices.getContentByStatus(userId, status);
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async deleteContentStatus(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as setContentStatusQuery;
      const { id: contentId } = request.params;
      const { id: userId } = request.user;
      const result = await userContentServices.deleteContentStatus({queryParams, contentId, userId});
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getWatchedContentBySeasonNumber(request: any, reply: FastifyReply){
    try {
      const { id: userId } = request.user;
      const { id, seasonNumber }   = request.params;
      const result = await userContentServices.getWatchedContentBySeasonNumber(userId, id, seasonNumber);
      
      const mappedEpisodes = result.map((item) => parseInt(item.episodeNumber));
      return reply.send(mappedEpisodes.sort((a, b) => a - b));
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async setContentRating(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as setContentRatingQuery;
      const { id: contentId, rate: contentRating } = request.params;
      const { id: userId } = request.user;
      const result = await userContentServices.setContentRating({queryParams, contentId, userId, contentRating});
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getContentRating(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as setContentRatingQuery;
      const { id: contentId } = request.params;
      const { id: userId } = request.user;
      const result = await userContentServices.getContentRating({queryParams, contentId, userId});
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getContentConsumption(request: any, reply: FastifyReply){
    try {
      const { id: userId } = request.user;
      const result = await userContentServices.getContentConsumption(userId);
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getContentRecommendation(request: any, reply: FastifyReply){
    try {
      const { id: userId } = request.user;
      const result = await userContentServices.getContentRecommendation(userId);
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },
}