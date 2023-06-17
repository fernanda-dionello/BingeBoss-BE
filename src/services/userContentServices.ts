import { setContentRatingQuery, setContentStatusQuery } from "../controllers/userContentController";
import userContentValidators from "./validators/userContentValidators";
import UserContent from "../models/userContentModel";
import ContentRating from "../models/contentRatingModel";
import { FastifyError } from 'fastify';

export default {
  async setContentStatus({
    queryParams,
    contentId,
    userId,
  }: {
    queryParams: setContentStatusQuery;
    contentId: string;
    userId: string;
  }) {
    userContentValidators.validateSetContentStatusQuery(queryParams);

    const seasonNumber =
      queryParams.type === "season" || queryParams.type === "episode"
        ? queryParams.seasonNumber
        : "-1";
    const episodeNumber =
      queryParams.type === "episode" ? queryParams.episodeNumber : "-1";

    const userContentDb = await UserContent.findOneAndUpdate(
      {
        userId,
        contentId,
        contentType: queryParams.type,
        seasonNumber,
        episodeNumber,
      },
      { contentStatus: queryParams.status },
      { new: true }
    );
    if (!userContentDb) {
      const userContent = new UserContent({
        userId,
        contentId,
        seasonNumber,
        episodeNumber,
        contentType: queryParams.type,
        contentStatus: queryParams.status,
      });

      return await userContent.save();
    }
    return userContentDb;
  },


  async setContentRating({
    queryParams,
    contentId,
    userId,
    contentRating,
  }: {
    queryParams: setContentRatingQuery;
    contentId: string;
    userId: string;
    contentRating: string;
  }) {
    userContentValidators.validateSetContentRatingQuery(queryParams);
    userContentValidators.validateSetContentRating(contentRating);

    const contentRatingDb = await ContentRating.findOneAndUpdate(
      {
        userId,
        contentId,
        contentType: queryParams.type
      },
      { rating: parseInt(contentRating) },
      { new: true }
    );
    if (!contentRatingDb) {
      const newContentRating = new ContentRating({
        userId,
        contentId,
        contentType: queryParams.type,
        rating: parseInt(contentRating)
      });

      return await newContentRating.save();
    }
    return contentRatingDb;
  },

  async getContentRating({
    queryParams,
    contentId,
    userId,
  }: {
    queryParams: setContentRatingQuery;
    contentId: string;
    userId: string;
  }){
    userContentValidators.validateSetContentRatingQuery(queryParams);             
    const contentRating = await ContentRating.findOne({userId, contentId, contentType: queryParams.type}).exec();
    
    if(contentRating == null){
      const errHandler: FastifyError = {
        name:"Not found",
        message:"Content rating not found",
        statusCode: 404,
        code: "404"
      }
      throw errHandler;
    }
    return contentRating
  },
};
