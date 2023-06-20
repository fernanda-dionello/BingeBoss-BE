import { FastifyReply } from "fastify";
import mongoose from "mongoose";
import contentService from "../services/contentService";
import { AxiosError } from "axios";
import { ContentCommentAttrs } from '../models/contentCommentModel';

export type ContentType = "movie" | "tv" | "season" | "episode";

export interface contentDetailsQuery {
  language?: string;
  type: ContentType;
  seasonNumber?: number;
  episodeNumber?: number;
}

export type ContentCommentType = 'movie' | 'episode'; 

export interface contentCommentQuery {
  type: ContentCommentType;
  seasonNumber?: number;
  episodeNumber?: number;
}

export default {
  async getContentDetails(request: any, reply: FastifyReply) {
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
        if (err.code == "ERR_BAD_REQUEST") {
          return reply.code(400).send("Bad request.");
        }
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async setContentComment(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as contentCommentQuery;
      const { id: contentId } = request.params;
      const { id: userId } = request.user;
      const {comment} = request.body as ContentCommentAttrs; 
      const result = await contentService.setContentComment({queryParams, contentId, userId, comment});
      return reply.code(201).send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async getContentComments(request: any, reply: FastifyReply){
    try {
      const queryParams = request.query as contentCommentQuery;
      const { id: contentId } = request.params;
      const result = await contentService.getContentComment({queryParams, contentId});
      return reply.send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },
};
