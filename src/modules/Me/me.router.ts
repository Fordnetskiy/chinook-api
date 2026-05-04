import { Router } from 'express';
import MeController from './me.controller';
import { validator } from '../../middlewares/validator';
import { MeUpdateSchema } from './me.schema';
import { ParamsSchema } from '../../utils/request.validation';
import { AuthNCheck } from '../../middlewares/auth.check';

const router = Router();

router.get('/', AuthNCheck, MeController.getMyProfile);

router.patch(
  '/',
  AuthNCheck,
  validator({ body: MeUpdateSchema }),
  MeController.updateMyProfile,
);

router.get('/invoices', AuthNCheck, MeController.getMyInvoices);

router.get(
  '/invoices/:id',
  AuthNCheck,
  validator({ params: ParamsSchema }),
  MeController.getMyInvoice,
);

export default router;
