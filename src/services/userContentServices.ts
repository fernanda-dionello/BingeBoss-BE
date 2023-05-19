import { ContentType, setContentStatusQuery } from '../controllers/userContentController';
import validateSetContentStatusQuery from './validators/userContentValidators';
import UserContent from '../models/userContentModel';

export default {
  async setContentStatus({queryParams, contentId, userId}: {
    queryParams: setContentStatusQuery,
    contentId: string;
    userId: string
  }){    
    validateSetContentStatusQuery(queryParams);
    const userContentDb = await UserContent.findOneAndUpdate(
      {userId, contentId, contentType: queryParams.type},
      {contentStatus: queryParams.status}, {new: true});
    if (!userContentDb) {
      const userContent = new UserContent({
        userId,
        contentId,
        contentType: queryParams.type,
        contentStatus: queryParams.status
      });
  
      return await userContent.save();
    }
    return userContentDb;
  },
}
