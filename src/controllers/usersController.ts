import { 
  FastifyRequest,
  FastifyReply
} from 'fastify';
import { UserAttrs, UserAttrsResult, UserParams } from '../models/usersModel';
import User from '../models/usersModel';
import usersServices from '../services/usersServices';
import mongoose from 'mongoose';
import { generateCrypto } from './utils/crypto';

export default {
  async showAll(request: FastifyRequest, reply: FastifyReply){
    try {
      const users = await usersServices.getAll();
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
      const user = await usersServices.getById(id);
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
  }
}