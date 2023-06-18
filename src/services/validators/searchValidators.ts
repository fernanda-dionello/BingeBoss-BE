import { searchQuery } from "../../controllers/searchController";
import Joi from "joi";
import { errorHandler } from "./common";
import { multiGenresIds } from '../utils/search.utils';

export const SearchSchema = Joi.object({
  title: Joi.string().optional(),
  adult: Joi.boolean().optional(),
  language: Joi.string().optional(),
  page: Joi.number().optional(),
  type: Joi.string().valid("multi", "movie", "person", "tv").required(),
  genre: Joi.array().items(
    Joi.string().valid(...multiGenresIds)
  )
});
const validateSearchQuery = (searchQuery: searchQuery) => {
  const result = SearchSchema.validate({
    ...searchQuery,
    genre: searchQuery.genre?.split(',')
  });
  if (result.error) {
    errorHandler(
      "Missing",
      result.error.details.map(({ message }) => message).join(";"),
      400,
      "400"
    );
  }
};

export default validateSearchQuery;
