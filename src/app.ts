import fastify from 'fastify';
import jwt from '@fastify/jwt';
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from './config/index';
import searchRoutes from './routes/searchRoutes';
import trendingRoutes from './routes/trendingRoutes';
import loginRoutes from './routes/loginRoutes';

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;
const secret = process.env.SECRET || '';

export const server = fastify();
server.register(jwt, {
  secret: secret
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
  next()
})

server.register(function unsecured (fastify, options, next) {
  fastify.register(loginRoutes)
  next()
})


server.listen({ port: +PORT}, (err, address = API_URL as string) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});