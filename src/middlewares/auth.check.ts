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

    const check = await RedisClient.get(`access:${token}`);

    if (!check) {
      next(
        createError(401, 'Invalid or expired token', {
          description: 'Token not found or expired',
        }),
      );
    }

    req.user = JSON.parse(check);
    next();
  } catch (e) {
    next(createError(500, 'Authentication middleware error'));
  }
};
