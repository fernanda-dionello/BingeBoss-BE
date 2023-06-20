import axios from "axios";
import { tokenTmdb } from "../config/commonVariables";
import { contentCommentQuery, contentDetailsQuery } from "../controllers/contentController";
import contentValidators from './validators/contentValidators';
import ContentComment from "../models/contentCommentModel";
import { FastifyError } from 'fastify';

export default {
  async getContentDetails(queryParams: contentDetailsQuery, id: string) {
    contentValidators.validateContentDetailsQuery(queryParams);
    const seasonNumber =
      queryParams.type === "season" || queryParams.type === "episode"
        ? queryParams.seasonNumber
        : "-1";
    const episodeNumber =
      queryParams.type === "episode" ? queryParams.episodeNumber : "-1";
    let url = "https://api.themoviedb.org/3";
    switch (queryParams.type) {
      case "tv":
        url = `${url}/${queryParams.type}/${id}`;
        break;
      case "movie":
        url = `${url}/${queryParams.type}/${id}`;
        break;
      case "season":
        url = `${url}/tv/${id}/${queryParams.type}/${seasonNumber}`;
        break;
      case "episode":
        url = `${url}/tv/${id}/season/${seasonNumber}/${queryParams.type}/${episodeNumber}`;
        break;
      default:
    }
    const contents = await axios.get(url, {
      headers: { Authorization: tokenTmdb },
      params: {
        language: queryParams?.language ?? "en-US",
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

    const seasonNumber =
       queryParams.type === "episode"
        ? queryParams.seasonNumber
        : "-1";
    const episodeNumber =
      queryParams.type === "episode" ? queryParams.episodeNumber : "-1";

    const contentComment = new ContentComment({
      userId,
      contentId,
      seasonNumber,
      episodeNumber,
      contentType: queryParams.type,
      comment,
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

    const seasonNumber =
      queryParams.type === "episode"
        ? queryParams.seasonNumber
        : "-1";
    const episodeNumber =
      queryParams.type === "episode" ? queryParams.episodeNumber : "-1";

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
