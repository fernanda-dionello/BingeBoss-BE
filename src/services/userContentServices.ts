import { getContentStatusQuery, setContentRatingQuery, setContentStatusQuery } from "../controllers/userContentController";
import userContentValidators from "./validators/userContentValidators";
import UserContent from "../models/userContentModel";
import ContentRating from "../models/contentRatingModel";
import { FastifyError } from 'fastify';
import { getContentAmount, getContentRuntime, getContentUrl, getDataHR } from './utils/content.utils';
import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';

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

    const seasonNumber: string =
      ((queryParams.type === "season" || queryParams.type === "episode")
        && queryParams.seasonNumber)
        ? queryParams.seasonNumber.toString()
        : "-1";
    const episodeNumber: string =
      (queryParams.type === "episode" && queryParams.episodeNumber) 
        ? queryParams.episodeNumber.toString() 
        : "-1";

    let runtime = 0;
    let amount = 0;
    let episodeAmount = 0;
    let movieAmount = 0;
    if (queryParams.status === 'watched') {
      const url = getContentUrl({
        id: contentId,
        type: queryParams.type,
        seasonNumber,
        episodeNumber
      });
      
      const contents = await axios.get(url, {
        headers: { Authorization: tokenTmdb },
        params: {
          language: "en-US",
        },
      });
      runtime = getContentRuntime(contents.data, queryParams.type);
      amount = getContentAmount(contents.data, queryParams.type);
      episodeAmount = (queryParams.type === 'episode' || queryParams.type === 'season') 
      ? amount 
      : 0;
      movieAmount = queryParams.type === 'movie' 
      ? amount
      : 0;
    }
    const userContentDb = await UserContent.findOneAndUpdate(
      {
        userId,
        contentId,
        contentType: queryParams.type,
        seasonNumber,
        episodeNumber,
      },
      { contentStatus: queryParams.status,
        contentRuntime: runtime,
        contentEpisodes: episodeAmount,
        contentMovie: movieAmount
      },
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
        contentRuntime: runtime,
        contentEpisodes: episodeAmount,
        contentMovie: movieAmount
      });

      return await userContent.save();
    } 
    return userContentDb;
  },

  async getContentStatus({
    queryParams,
    contentId,
    userId,
  }: {
    queryParams: getContentStatusQuery;
    contentId: string;
    userId: string;
  }) {
    userContentValidators.validateGetContentStatusQuery(queryParams);

    const seasonNumber: string =
      ((queryParams.type === "season" || queryParams.type === "episode")
        && queryParams.seasonNumber)
        ? queryParams.seasonNumber.toString()
        : "-1";

    const episodeNumber: string =
      (queryParams.type === "episode" && queryParams.episodeNumber) 
      ? queryParams.episodeNumber.toString()
      : "-1";

    const userContent = await UserContent.findOne(
      {
        userId,
        contentId,
        contentType: queryParams.type,
        seasonNumber,
        episodeNumber,
      }
    );
    if(userContent == null){
      const errHandler: FastifyError = {
        name:"Not found",
        message:"User content not found",
        statusCode: 404,
        code: "404"
      }
      throw errHandler;
    }
    return userContent
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

  async getContentConsumption(userId: string) {             
    const watchedContent = await UserContent.find({userId, contentStatus: 'watched'}).exec();
    const consumption = watchedContent.reduce((result, content) => {
      return { 
        totalRuntime: result.totalRuntime + content.contentRuntime, 
        totalEpisodes: result.totalEpisodes + content.contentEpisodes,
        totalMovies: result.totalMovies + content.contentMovie,  
       }
      },
      { totalRuntime: 0 as number, totalEpisodes: 0 as number, totalMovies: 0 as number }
    );
    const totalRuntime =  getDataHR(consumption.totalRuntime);
    
    if(watchedContent == null){
      const errHandler: FastifyError = {
        name:"Not found",
        message:"Content rating not found",
        statusCode: 404,
        code: "404"
      }
      throw errHandler;
    }
    return {
      ...consumption,
      totalYears: totalRuntime.years,
      totalMonths: totalRuntime.months,
      totalWeeks: totalRuntime.weeks,
      totalDays: totalRuntime.days,
      totalHours: totalRuntime.hours,
      totalMinutes: totalRuntime.minutes
    }
  },
};
