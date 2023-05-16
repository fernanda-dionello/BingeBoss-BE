import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';
import { topTenQuery } from '../controllers/trendingController';
import validateTopTenQuery from './validators/trendingValidators';

export default {
  async topTen(queryParams: topTenQuery){    
    try{
      validateTopTenQuery(queryParams);
      const contents = await axios.get(`https://api.themoviedb.org/3/trending/${queryParams.type ?? 'all'}/day`, 
      { 
        headers: { Authorization: tokenTmdb },
        params: {
          language:queryParams?.language ?? "en-US"
        }
      })
      return contents.data.results.slice(0, 10)

    } catch(err){
      console.log("error");
      throw err
    }       
  }
}