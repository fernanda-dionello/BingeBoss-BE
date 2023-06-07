import { setContentStatusQuery } from '../controllers/userContentController';
import validateSetContentStatusQuery from './validators/userContentValidators';
import UserContent from '../models/userContentModel';

export default {
  async setContentStatus({queryParams, contentId, userId}: {
    queryParams: setContentStatusQuery,
    contentId: string;
    userId: string
  }){    
    const seasonNumber = 
    (queryParams.type === 'season' || queryParams.type === 'episode') 
    ? queryParams.seasonNumber 
    : '-1';
    const episodeNumber = queryParams.type === 'episode' ? queryParams.episodeNumber : '-1';
    validateSetContentStatusQuery(queryParams);
    const userContentDb = await UserContent.findOneAndUpdate(
      {userId, contentId, contentType: queryParams.type, seasonNumber, episodeNumber},
      {contentStatus: queryParams.status}, {new: true});
    if (!userContentDb) {
      const userContent = new UserContent({
        userId,
        contentId,
        seasonNumber,
        episodeNumber,
        contentType: queryParams.type,
        contentStatus: queryParams.status
      });
  
      return await userContent.save();
    }
    return userContentDb;
  },
}
