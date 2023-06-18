import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';
import { searchQuery } from '../controllers/searchController';
import validateSearchQuery from './validators/searchValidators';

export default {
  async search(queryParams: searchQuery){  
    validateSearchQuery(queryParams);
    const contents = ((!queryParams.title) && (queryParams.type === 'movie' || queryParams.type === 'tv')) 
    ? await axios.get(`https://api.themoviedb.org/3/discover/${queryParams.type}`, 
    { 
      headers: { Authorization: tokenTmdb },
      params: {
        include_adult:queryParams?.adult ?? false,
        language:queryParams?.language ?? "en-US",
        page:queryParams?.page ?? 1
      }
    }) 
    : await axios.get(`https://api.themoviedb.org/3/search/${queryParams.type}`, 
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
      const genres = queryParams.genre?.split(',');
      let genreIds: number[];
      switch (queryParams.type) {
        case 'movie':
          genreIds = genres.map((genre) => parseInt(genre));
          contents.data.results = contents.data.results.filter((content: any) => content.genre_ids.some( (genre: number) => genreIds.includes(genre) ));
          break;
        case 'tv':
          genreIds = genres.map((genre) => parseInt(genre));
          contents.data.results = contents.data.results.filter((content: any) => content.genre_ids.some( (genre: number) => genreIds.includes(genre) ));
        break;
        case 'person':
          genreIds = genres.map((genre) => parseInt(genre));
          contents.data.results = contents.data.results.filter((content: any) => genreIds.includes(content.gender));
        break;
        case 'multi':
          genreIds = genres.map((genre) => parseInt(genre));
          contents.data.results = contents.data.results.filter((content: any) => 
          content.media_type === 'person' ? genreIds.includes(content.gender) : content.genre_ids.some( (genre: number) => genreIds.includes(genre) ));
        break;
        default:
          genreIds = [];
      }
    }
    return contents.data
  }
}