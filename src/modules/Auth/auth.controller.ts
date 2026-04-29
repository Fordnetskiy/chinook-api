import { Request, Response, NextFunction } from 'express';
import AuthService from './auth.service';

class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Successful registration',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.login(req.body);

      res.status(200).json({
        success: true,
        message: 'Login success',
        token: result,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default new AuthController();
