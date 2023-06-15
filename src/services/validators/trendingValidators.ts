import { topTenQuery } from "../../controllers/trendingController";
import Joi from "joi";
import { errorHandler } from "./common";

export const TopTenSchema = Joi.object({
  language: Joi.string().optional(),
  type: Joi.string().valid("all", "movie", "person", "tv").optional(),
});
const validateTopTenQuery = (topTenQuery: topTenQuery) => {
  const result = TopTenSchema.validate(topTenQuery);
  if (result.error) {
    errorHandler(
      "Missing",
      result.error.details.map(({ message }) => message).join(";"),
      400,
      "400"
    );
  }
};

export default validateTopTenQuery;
