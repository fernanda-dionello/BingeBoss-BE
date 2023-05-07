import { FastifyError, FastifyReply } from 'fastify';

const errorHandler = (error: FastifyError, reply: FastifyReply) => {
  error.code 
      ? reply.code(+error.code).send(error.message)
      : reply.status(500).send("Err not identified");  
}

export default errorHandler;