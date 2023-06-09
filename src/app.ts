import fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from './config/index';
import searchRoutes from './routes/searchRoutes';
import trendingRoutes from './routes/trendingRoutes';
import loginRoutes from './routes/loginRoutes';
import usersRoutes from './routes/usersRoutes';
import userContentRoutes from './routes/userContentRoutes';
import contentRoutes from './routes/contentRoutes';
import userRoutes from './routes/userRoutes';

const PORT = parseInt(process.env.PORT ?? '3000');
const HOST = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;
const secret = process.env.SECRET || '';

export const server = fastify();
server.register(jwt, {
  secret: secret
});

server.register(cors, {
  origin: '*'
});

server.register(ConnectDB);
server.register(function secured (fastify, options, next) {
  fastify.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(403).send("Invalid Token")
    }
  })
  fastify.register(searchRoutes)
  fastify.register(trendingRoutes)
  fastify.register(userContentRoutes)
  fastify.register(contentRoutes)
  fastify.register(userRoutes)
  next()
})

server.register(function unsecured (fastify, options, next) {
  fastify.register(loginRoutes)
  fastify.register(usersRoutes)
  next()
})


server.listen({host: HOST, port: PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});