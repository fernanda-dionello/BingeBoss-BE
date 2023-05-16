import fastify from 'fastify';
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from './config/index';
import usersRoutes from './routes/usersRoutes';
import searchRoutes from './routes/searchRoutes';
import loginRoutes from './routes/loginRoutes';

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL;

const server = fastify();
server.register(ConnectDB);
server.register(usersRoutes);
server.register(searchRoutes);
server.register(loginRoutes);

server.listen({ port: +PORT}, (err, address = API_URL as string) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
});