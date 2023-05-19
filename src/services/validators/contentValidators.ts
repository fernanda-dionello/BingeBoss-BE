import { contentDetailsQuery } from '../../controllers/contentController';
import Joi from 'joi';
import { errorHandler } from './common';

export const ContentDetailsSchema = Joi.object({
  language: Joi.string().optional(),
  type: Joi.string().valid("movie", "tv").required(),
})
const validateContentDetailsQuery = (query: contentDetailsQuery)=> {
  const result = ContentDetailsSchema.validate(query);
  if (result.error) {
    errorHandler(
      "Missing",
      result.error.details[0].message,
      400,
      "400"
    )
  }
}

export default validateContentDetailsQuery;