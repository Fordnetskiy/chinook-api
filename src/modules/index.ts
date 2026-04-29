import { Router } from 'express';
import AuthRoutes from './Auth/auth.router';

const router = Router();

router.use('/auth', AuthRoutes);

export default router;
