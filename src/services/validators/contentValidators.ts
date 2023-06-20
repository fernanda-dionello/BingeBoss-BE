import { contentCommentQuery, contentDetailsQuery } from "../../controllers/contentController";
import Joi from "joi";
import { errorHandler } from "./common";

export const ContentDetailsSchema = Joi.object({
  language: Joi.string().optional(),
  type: Joi.string().valid("movie", "tv", "season", "episode").required(),
  seasonNumber: Joi.number().when("type", {
    is: "season",
    then: Joi.number().required(),
  })
  .concat(Joi.number().when("type", {
    is: "episode",
    then: Joi.number().required(),
  })),
  episodeNumber: Joi.number().when("type", {
    is: "episode",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  }),
});

const contentCommentSchema = Joi.object({
  type: Joi.string().valid("movie", "episode").required(),
  seasonNumber: Joi.number().when("type", {
    is: "episode",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  }),
  episodeNumber: Joi.number().when("type", {
    is: "episode",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  }),
});

export default {
  validateContentDetailsQuery(query: contentDetailsQuery){
    const result = ContentDetailsSchema.validate(query);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },
  validateContentCommentQuery(query: contentCommentQuery) {
    const result = contentCommentSchema.validate(query);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },

}
