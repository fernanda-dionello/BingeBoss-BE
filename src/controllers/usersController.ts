import { 
  FastifyRequest,
  FastifyReply
} from 'fastify';
import { UpdateUserAttrs, UserAttrs, UserAttrsResult, UserParams, UserSpoilerProtectionParams } from '../models/usersModel';
import User from '../models/usersModel';
import usersServices from '../services/usersServices';
import mongoose from 'mongoose';
import { generateCrypto } from './utils/crypto';

export default {
  async showAll(request: FastifyRequest, reply: FastifyReply){
    try {
      let users: UserAttrsResult[] = await usersServices.getAll();
      users = users.map(user => {
        user = user.toObject();
        delete user.password;
        return user
      })
      return reply.send(users);
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("Users not found.");
      }
      request.log.error(err);
      return reply.send(500);
    }
  },

  async showById(request: FastifyRequest, reply: FastifyReply){
    try {
      const { id } = request.params as UserParams;
      let user: UserAttrsResult = await usersServices.getById(id);
      user = user.toObject();
      delete user.password;
      return reply.send(user);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("User not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async deleteById(request: any, reply: FastifyReply){
    try {
      const { id } = request.params as UserParams;
      const { id: userId } = request.user;
      const user = await usersServices.deleteById(id, userId);
      return reply.send(user);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("User not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async create(request: FastifyRequest, reply: FastifyReply){
    try {
      const user = new User(request.body as UserAttrs); 
      user.password = generateCrypto(user.password);
      user.spoilerProtection = true;
      let userCreated: UserAttrsResult = await user.save();
      userCreated = userCreated.toObject();
      delete userCreated.password;

      return reply.code(201).send(userCreated);
    } catch (err: any) {
      if(err.code == "11000"){
        return reply.code(403).send("This email is already in use.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async updateById(request: any, reply: FastifyReply){
    try {
      const user = request.body as UpdateUserAttrs; 
      const { id } = request.params as UserParams;
      const { id: userId } = request.user;
      let updatedUser: UserAttrsResult = await usersServices.updateById(user, id, userId);
      updatedUser = updatedUser.toObject();
      delete updatedUser.password;
      return reply.send(updatedUser);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("User not found.");
      }
      if(err.code == "11000"){
        return reply.code(403).send("This email is already in use.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },

  async setSpoilerProtection(request: any, reply: FastifyReply){
    try {
      const { id, isEnabled } = request.params as UserSpoilerProtectionParams;
      const { id: userId } = request.user;
      let result: UserAttrsResult = await usersServices.setSpoilerProtection(id, userId, isEnabled);
      result = result.toObject();
      delete result.password;
      return reply.code(200).send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.CastError) {
        return reply.code(404).send("User not found.");
      }
      return reply.code(err.code || 500).send(err.message);
    }
  },
}