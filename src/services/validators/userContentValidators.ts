import Joi from "joi";
import { errorHandler } from "./common";
import { getContentStatusQuery, setContentRatingQuery, setContentStatusQuery } from "../../controllers/userContentController";

const setContentStatusSchema = Joi.object({
  status: Joi.string()
    .valid("watched", "abandoned", "watching", "myList")
    .required(),
  type: Joi.string().valid("movie", "tv", "season", "episode").required(),
  seasonNumber: Joi.number().when("type", {
    is: "season",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  })
  .concat(
    Joi.number().when("type", {
      is: "episode",
      then: Joi.number().required(),
      otherwise: Joi.optional(),
    })
  ),
  episodeNumber: Joi.number().when("type", {
    is: "episode",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  }),
});

const getContentStatusSchema = Joi.object({
  type: Joi.string().valid("movie", "tv", "season", "episode").required(),
  seasonNumber: Joi.number().when("type", {
    is: "season",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  })
  .concat(
    Joi.number().when("type", {
      is: "episode",
      then: Joi.number().required(),
      otherwise: Joi.optional(),
    })
  ),
  episodeNumber: Joi.number().when("type", {
    is: "episode",
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  }),
});

const setContentRatingSchema = Joi.object({
  type: Joi.string().valid("movie", "tv").required(),
});

const getContentByStatusSchema = Joi.object({
  status: Joi.string().valid("watching", "watched", "abandoned", "myList").required(),
});
export default {
  validateSetContentStatusQuery(query: setContentStatusQuery) {
    const result = setContentStatusSchema.validate(query);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },

  validateGetContentStatusQuery(query: getContentStatusQuery) {
    const result = getContentStatusSchema.validate(query);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },

  validateSetContentRatingQuery(query: setContentRatingQuery) {
    const result = setContentRatingSchema.validate(query);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },

  validateSetContentRating(contentRating: string) {
    if (!parseInt(contentRating) || parseInt(contentRating) < 1 || parseInt(contentRating) > 5){
      errorHandler(
        "Bad Request",
        "Rating must be an integer from 1 to 5"
      );
    }
  },

  validateGetContentByStatusParam(status: string) {
    const result = getContentByStatusSchema.validate({status});
    if (result.error) {
      errorHandler(
        "Bad Request",
        result.error.details.map(({ message }) => message).join(";"),
      );
    }
  },
}
