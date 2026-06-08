import { Router } from 'express';
import TracksController from './tracks.controller';
import { validator } from '../../../middlewares/validator';
import { ParamsSchema } from '../../../utils/request.validation';
import { RoleCheck, AuthNCheck } from '../../../middlewares/auth.check';
import { CreateTrackSchema, UpdateTrackSchema } from './tracks.schema';

const router = Router();

router.post(
  '/',
  AuthNCheck,
  RoleCheck(['ADMIN', 'EMPLOYEE']),
  validator({ body: CreateTrackSchema }),
  TracksController.createTrack,
);

router.get('/', TracksController.getAllTracks);
router.get(
  '/:id',
  validator({ params: ParamsSchema }),
  TracksController.getTrack,
);

router.patch(
  '/:id',
  AuthNCheck,
  RoleCheck(['ADMIN', 'EMPLOYEE']),
  validator({ params: ParamsSchema }),
  validator({ body: UpdateTrackSchema }),
  TracksController.updateTrack,
);

router.delete(
  '/:id',
  AuthNCheck,
  RoleCheck(['ADMIN', 'EMPLOYEE']),
  validator({ params: ParamsSchema }),
  TracksController.deleteTrack,
);

export default router;
