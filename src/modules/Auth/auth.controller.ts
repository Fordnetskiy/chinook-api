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
        status: 'success',
        data: result,
        message: 'Successful registration',
      });
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AuthService.login(req.body);

      res.status(200).json({
        status: 'success',
        token: result,
        message: 'Login success',
      });
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: Request['token'] = req.token;

      await AuthService.logout(token);

      res.status(200).json({
        status: 'success',
        message: 'Logout success',
      });
    } catch (e) {
      next(e);
    }
  };
}

export default new AuthController();
