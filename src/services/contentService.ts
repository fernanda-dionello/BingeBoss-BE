import axios from "axios";
import { tokenTmdb } from "../config/commonVariables";
import { contentCommentQuery, contentDetailsQuery } from "../controllers/contentController";
import contentValidators from './validators/contentValidators';
import ContentComment from "../models/contentCommentModel";
import { FastifyError } from 'fastify';
import { getContentUrl } from './utils/content.utils';
import usersServices from './usersServices';

export default {
  async getContentDetails(queryParams: contentDetailsQuery, id: string) {
    contentValidators.validateContentDetailsQuery(queryParams);
    const seasonNumber: string =
      ((queryParams.type === "season" || queryParams.type === "episode") && queryParams.seasonNumber)
        ? queryParams.seasonNumber?.toString()
        : "-1";
    const episodeNumber: string =
      (queryParams.type === "episode" && queryParams.episodeNumber) 
        ? queryParams.episodeNumber?.toString() 
        : "-1";
    const url = getContentUrl({
      id,
      type: queryParams.type,
      seasonNumber,
      episodeNumber
    });
    
    const contents = await axios.get(url, {
      headers: { Authorization: tokenTmdb },
      params: {
        language: queryParams?.language ?? "en-US",
        append_to_response: 'credits'
      },
    });
    return contents.data;
  },

  async setContentComment({
    queryParams,
    contentId,
    userId,
    comment,
  }: {
    queryParams: contentCommentQuery;
    contentId: string;
    userId: string;
    comment: string;
  }) {
    contentValidators.validateContentCommentQuery(queryParams);
    const user = await usersServices.getById(userId);
    const seasonNumber: string =
       (queryParams.type === "episode" && queryParams.seasonNumber)
        ? queryParams.seasonNumber?.toString()
        : "-1";
    const episodeNumber: string =
      (queryParams.type === "episode" && queryParams.episodeNumber) 
        ? queryParams.episodeNumber?.toString() 
        : "-1";

    const contentComment = new ContentComment({
      userId,
      contentId,
      seasonNumber,
      episodeNumber,
      contentType: queryParams.type,
      comment,
      userName: `${user.firstName} ${user.lastName}`
    });

    return await contentComment.save();
  },

  async getContentComment({
    queryParams,
    contentId,
  }: {
    queryParams: contentCommentQuery;
    contentId: string;
  }) {
    contentValidators.validateContentCommentQuery(queryParams);

    const seasonNumber: string =
      (queryParams.type === "episode" && queryParams.seasonNumber)
        ? queryParams.seasonNumber?.toString()
        : "-1";
    const episodeNumber: string =
      (queryParams.type === "episode" && queryParams.episodeNumber) 
        ? queryParams.episodeNumber?.toString() 
        : "-1";

    const contentComment = await ContentComment.find(
      {
        contentId,
        contentType: queryParams.type,
        seasonNumber,
        episodeNumber,
      }
    );
    if(contentComment.length == 0){
      const errHandler: FastifyError = {
        name:"Not found",
        message:"Comments not found",
        statusCode: 404,
        code: "404"
      }
      throw errHandler;
    }
    return contentComment
  },
};
