import { searchQuery } from "../../controllers/searchController";
import Joi from "joi";
import { errorHandler } from "./common";

export const SearchSchema = Joi.object({
  title: Joi.string().required(),
  adult: Joi.boolean().optional(),
  language: Joi.string().optional(),
  page: Joi.number().optional(),
  type: Joi.string().valid("multi", "movie", "person", "tv").required(),
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
