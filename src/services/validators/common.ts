import { FastifyError } from 'fastify';

export const errorHandler = (name: string, message: string, statusCode?: number, code?: string) => {
  const err: FastifyError = {
    name,
    message,
    statusCode: statusCode || 404,
    code: code || "404"
  }
  throw err;
}