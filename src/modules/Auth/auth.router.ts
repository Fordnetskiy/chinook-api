import { Router } from 'express';
import AuthController from './auth.controller';
import { validator } from '../../middlewares/validator';
import { RegisterSchema, LoginSchema } from './auth.schema';
import { AuthNCheck } from '../../middlewares/auth.check';

const router = Router();

router.post(
  '/register',
  validator({ body: RegisterSchema }),
  AuthController.register,
);

router.post('/login', validator({ body: LoginSchema }), AuthController.login);

router.post('/logout', AuthNCheck, AuthController.logout);

export default router;
