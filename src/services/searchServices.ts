import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';
import { searchQuery } from '../controllers/searchController';
import validateSearchQuery from './validators/searchValidators';

export default {
  async search(queryParams: searchQuery){  
    validateSearchQuery(queryParams);
    let contents;
    if ((!queryParams.title) && ((queryParams.type === 'movie' || queryParams.type === 'tv' || queryParams.type === 'multi'))) {
      if ((queryParams.type === 'movie' || queryParams.type === 'tv')) {
        contents = await axios.get(`https://api.themoviedb.org/3/discover/${queryParams.type}`, 
        { 
          headers: { Authorization: tokenTmdb },
          params: {
            include_adult:queryParams?.adult ?? false,
            language:queryParams?.language ?? "en-US",
            page:queryParams?.page ?? 1
          }
        })
        contents.data.results = contents.data.results.map((content: any) => ({...content, media_type: queryParams.type}))
      } else {
        contents = await axios.get(`https://api.themoviedb.org/3/discover/tv`, 
        { 
          headers: { Authorization: tokenTmdb },
          params: {
            include_adult:queryParams?.adult ?? false,
            language:queryParams?.language ?? "en-US",
            page:queryParams?.page ?? 1
          }
        })

        contents.data.results = contents.data.results.map((tvContent: any) => ({...tvContent, media_type: 'tv'}))
        const movieContents = await axios.get(`https://api.themoviedb.org/3/discover/movie`, 
        { 
          headers: { Authorization: tokenTmdb },
          params: {
            include_adult:queryParams?.adult ?? false,
            language:queryParams?.language ?? "en-US",
            page:queryParams?.page ?? 1
          }
        })
        contents.data.results.push(...movieContents.data.results.map((movieContent: any) => ({...movieContent, media_type: 'movie'})));
      }
    }
    else {
      contents = await axios.get(`https://api.themoviedb.org/3/search/${queryParams.type}`, 
      { 
        headers: { Authorization: tokenTmdb },
        params: {
          query:queryParams?.title ?? '',
          include_adult:queryParams?.adult ?? false,
          language:queryParams?.language ?? "en-US",
          page:queryParams?.page ?? 1
        }
      });
    }
    
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