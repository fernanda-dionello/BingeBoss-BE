import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';
import { searchQuery } from '../controllers/searchController';
import validateSearchQuery from './validators/searchValidators';
import { getMovieGenreId, getMultiGenreId, getPersonGenderId } from './utils/search.utils';
import { getTvGenreId } from './utils/search.utils';

export default {
  async search(queryParams: searchQuery){  
    validateSearchQuery(queryParams);
    const contents = await axios.get(`https://api.themoviedb.org/3/search/${queryParams.type}`, 
    { 
      headers: { Authorization: tokenTmdb },
      params: {
        query:queryParams?.title ?? '',
        include_adult:queryParams?.adult ?? false,
        language:queryParams?.language ?? "en-US",
        page:queryParams?.page ?? 1
      }
    });

    if (queryParams.genre) {
      let genreId: number;
      switch (queryParams.type) {
        case 'movie':
            genreId = getMovieGenreId(queryParams.genre);
            contents.data.results = contents.data.results.filter((content: any) => content.genre_ids.includes(genreId));
          break;
        case 'tv':
          genreId = getTvGenreId(queryParams.genre);
          contents.data.results = contents.data.results.filter((content: any) => content.genre_ids.includes(genreId));
        break;
        case 'person':
          genreId = getPersonGenderId(queryParams.genre);
          contents.data.results = contents.data.results.filter((content: any) => content.gender === genreId);
        break;
        case 'multi':
          genreId = getMultiGenreId(queryParams.genre);
          contents.data.results = contents.data.results.filter((content: any) => 
          content.media_type === 'person' ? content.gender === genreId : content.genre_ids.includes(genreId));
        break;
        default:
          genreId = 0;
      }
    }
    return contents.data
  }
}