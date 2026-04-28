import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { ValidationSchemas } from '../types/tschema';

export const validator = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: Record<string, any> = {};
    let hasError = false;

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.body = result.error.flatten().fieldErrors;
        hasError = true;
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.query = result.error.flatten().fieldErrors;
        hasError = true;
      } else {
        req.query = result.data as any;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.params = result.error.flatten().fieldErrors;
        hasError = true;
      } else {
        req.params = result.data as any;
      }
    }

    if (hasError) {
      const err = createError(400, 'Validation Failed', {
        description: 'Failed to validate request data',
        errors,
      });
      return next(err);
    }

    next();
  };
};
