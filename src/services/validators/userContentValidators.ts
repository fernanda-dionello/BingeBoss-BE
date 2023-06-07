import Joi from 'joi';
import { errorHandler } from './common';
import { setContentStatusQuery } from '../../controllers/userContentController';

export const setContentStatusSchema = Joi.object({
  status: Joi.string().valid("watched", "abandoned", "watching", "myList").required(),
  type: Joi.string().valid("movie", "tv", "season", "episode").required(),
  seasonNumber: Joi.number().when('type', {
    is: 'season' || 'episode',
    then: Joi.number().required(),
    otherwise: Joi.optional()
  }),
  episodeNumber: Joi.number().when('type', {
    is: 'episode',
    then: Joi.number().required(),
    otherwise: Joi.optional()
  }),
})
const validateSetContentStatusQuery = (query: setContentStatusQuery)=> {
  const result = setContentStatusSchema.validate(query);
  if (result.error) {
    errorHandler(
      "Missing",
      result.error.details[0].message,
      400,
      "400"
    )
  }
}

export default validateSetContentStatusQuery;