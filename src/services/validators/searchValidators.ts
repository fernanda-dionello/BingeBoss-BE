import { searchQuery } from "../../controllers/searchController";
import Joi from "joi";
import { errorHandler } from "./common";
import { movieGenresNames, multiGenresNames, personGendersNames, tvGenresNames } from '../utils/search.utils';

export const SearchSchema = Joi.object({
  title: Joi.string().optional(),
  adult: Joi.boolean().optional(),
  language: Joi.string().optional(),
  page: Joi.number().optional(),
  type: Joi.string().valid("multi", "movie", "person", "tv").required(),
  genre: Joi.string()
    .when('type', { is: 'movie', then: Joi.string().valid(...movieGenresNames) })
    .concat(
      Joi.string()
      .when('type', { is: 'tv', then: Joi.string().valid(...tvGenresNames) }))
    .concat(
      Joi.string()
      .when('type', { is: 'person', then: Joi.string().valid(...personGendersNames) }))
    .concat(
      Joi.string()
      .when('type', { is: 'multi', then: Joi.string().valid(...multiGenresNames) }))
});
const validateSearchQuery = (searchQuery: searchQuery) => {
  const result = SearchSchema.validate(searchQuery);
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
