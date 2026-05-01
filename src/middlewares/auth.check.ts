import { Request, Response, NextFunction } from 'express';
import RedisClient from '../config/redis';
import createError from 'http-errors';

export const AuthNCheck = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(
        createError(401, 'Token not provided', {
          description: 'Unauthorized. Token not provided in headers',
        }),
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(createError(401, 'Invalid token format'));
    }

    const userData = await RedisClient.get(`access:${token}`);

    if (!userData) {
      return next(
        createError(401, 'Invalid or expired token', {
          description: 'Token not found or expired',
        }),
      );
    }

    req.user = JSON.parse(userData);
    req.token = token;

    next();
  } catch (e) {
    next(e);
  }
};
