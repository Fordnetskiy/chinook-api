import { Request, Response, NextFunction } from 'express';
import { ProblemDocument } from 'http-problem-details';
import { HttpError } from 'http-errors';
import { logger } from '../utils/logger';

export const ErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const envCheck = process.env.NODE_ENV?.trim();
  const isDev = envCheck === 'development';

  const status: number = err.status || 500;
  const isUnexpected: boolean = status >= 500;

  // logger
  if (isUnexpected) {
    logger.error(`[Unexpected Error] ${err.message}`, {
      status,
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
    });
  } else {
    logger.warn(`[Client Error]`, {
      status,
      method: req.method,
      url: req.originalUrl,
      invalidParams: err.errors,
    });
  }

  const extensions: Record<string, any> = {};

  if (isDev) {
    extensions.stack = err.stack;
  }
  if (err.errors) {
    extensions.invalidParams = err.errors;
  }

  const result = new ProblemDocument(
    {
      status,
      instance: req.originalUrl,
      title: isUnexpected && !isDev ? 'Internal Server Error' : err.message,
      type: `http://chinnok-api/errors/${status}`,
      detail:
        isUnexpected && !isDev
          ? 'Something Went Wrong'
          : err.description || err.message,
    },
    extensions,
  );

  res
    .status(status)
    .set('Content-Type', 'application/problem+json')
    .json(result);
};

export const ResourceNotFound = (
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  res.status(404).json({
    status: 404,
    instance: req.originalUrl,
    title: 'This resource not exist',
    type: `http://chinnok-api/errors/resource-not-found`,
  });
};
