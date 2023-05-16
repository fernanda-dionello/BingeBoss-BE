import { 
  FastifyRequest,
  FastifyReply
} from 'fastify';
import { UserLoginAttrs } from '../models/usersModel';
import loginServices from '../services/loginServices';

export default {
  async login(request: FastifyRequest, reply: FastifyReply){
    try {
      const user = request.body as UserLoginAttrs; 

      const token = await loginServices.userValidation(user);
      return reply.code(201).send({"token":token});
    } catch (err: any) {
      return reply.code(err.code || 500).send(err.message);
    }
  }
}