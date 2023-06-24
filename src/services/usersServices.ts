import { generateCrypto } from '../controllers/utils/crypto';
import User, { UpdateUserAttrs } from '../models/usersModel';
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
  },

  async deleteById(id: string, userId: string){
    
    userValidators.validateDeleteUserId(id, userId);             
    const user = await User.deleteOne({_id: id}).exec();
    
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
  },

  async updateById(userBody: UpdateUserAttrs, id: string, userId: string){
    userValidators.validateUpdateUserId(id, userId, userBody);      
    
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
    userBody.oldPassword && userValidators.validateUpdateUserPassword(userBody, user);

    const password = userBody.newPassword ? generateCrypto(userBody.newPassword) : user.password;
    const updatedUser = await User.findByIdAndUpdate(
      {_id: id}, 
      {
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        email: userBody.email,
        password
    
      },
      { new: true }
      ).exec();
    
    if(updatedUser == null){
      const errHandler: FastifyError = {
        name:"Not found",
        message:"User not found",
        statusCode: 404,
        code: "404"
      }
      throw errHandler;
    }
    return updatedUser
  },

  async setSpoilerProtection(id: string, userId: string, isEnabled: string){
    userValidators.validateSetSpoilerProtectionUserId(id, userId, isEnabled);  
    const isSpoilerProtectionEnabled = (isEnabled === 'true');    
    const user = await User.findByIdAndUpdate(
      {_id: id}, 
      {
        spoilerProtection: isSpoilerProtectionEnabled,
      },
      { new: true }
      ).exec();
    
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