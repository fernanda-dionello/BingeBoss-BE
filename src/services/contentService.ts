import axios from "axios";
import { tokenTmdb } from "../config/commonVariables";
import { contentDetailsQuery } from "../controllers/contentController";
import validateContentDetailsQuery from "./validators/contentValidators";

export default {
  async getContentDetails(queryParams: contentDetailsQuery, id: string) {
    validateContentDetailsQuery(queryParams);
    const seasonNumber =
      queryParams.type === "season" || queryParams.type === "episode"
        ? queryParams.seasonNumber
        : "-1";
    const episodeNumber =
      queryParams.type === "episode" ? queryParams.episodeNumber : "-1";
    let url = "https://api.themoviedb.org/3";
    switch (queryParams.type) {
      case "tv":
        url = `${url}/${queryParams.type}/${id}`;
        break;
      case "movie":
        url = `${url}/${queryParams.type}/${id}`;
        break;
      case "season":
        url = `${url}/tv/${id}/${queryParams.type}/${seasonNumber}`;
        break;
      case "episode":
        url = `${url}/tv/${id}/season/${seasonNumber}/${queryParams.type}/${episodeNumber}`;
        break;
      default:
    }
    const contents = await axios.get(url, {
      headers: { Authorization: tokenTmdb },
      params: {
        language: queryParams?.language ?? "en-US",
      },
    });
    return contents.data;
  },
};
