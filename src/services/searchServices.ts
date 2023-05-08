import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';
import { searchQuery } from '../controllers/searchController';
import validateSearchQuery from './validators/searchValidators';

export default {
  async search(queryParams: searchQuery){    
    try{
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
      })
      return contents.data

    } catch(err){
      console.log("error");
      throw err
    }       
  }
}