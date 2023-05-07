import { errorHandler } from './common';

const validateUserId = (id: string) => {
  if(!id){
    errorHandler("Id is missing","User Id is missing");
  }
}

export default validateUserId;