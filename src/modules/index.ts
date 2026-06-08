import { Router } from 'express';
import AuthRoutes from './Auth/auth.router';
import MeRoutes from './Me/me.router';
import CatalogRoutes from './Catalog/catalog.router';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/me', MeRoutes);
router.use('/catalog', CatalogRoutes);

export default router;
