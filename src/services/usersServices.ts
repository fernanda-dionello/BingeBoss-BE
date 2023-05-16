import User from '../models/usersModel';
import userValidators from './validators/usersValidators';
import { FastifyError } from 'fastify';

export default {
  async getAll(){
    return await User.find();
  },

  async getById(id: string){
    userValidators.validateUserId(id);             
      const user = await User.findById(id).exec();
      
      if(user == null){
        const errHandler: FastifyError = {
          name:"Not found",
          message:"User not found",
          statusCode: 404,
          code: "404"
        }
        throw errHandler;
      }
      return user
  }
}