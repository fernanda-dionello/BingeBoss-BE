import axios from 'axios';
import { tokenTmdb } from '../config/commonVariables';
import { contentDetailsQuery } from '../controllers/contentController';
import validateContentDetailsQuery from './validators/contentValidators';

export default {
  async getContentDetails(queryParams: contentDetailsQuery, id: string){    
    validateContentDetailsQuery(queryParams);
    const contents = await axios.get(`https://api.themoviedb.org/3/${queryParams.type}/${id}`, 
    { 
      headers: { Authorization: tokenTmdb },
      params: {
        language:queryParams?.language ?? "en-US"
      }
    });
    return contents.data
  }
}