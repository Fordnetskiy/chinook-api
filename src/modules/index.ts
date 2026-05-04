import { Router } from 'express';
import AuthRoutes from './Auth/auth.router';
import MeRoutes from './Me/me.router';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/me', MeRoutes);

export default router;
