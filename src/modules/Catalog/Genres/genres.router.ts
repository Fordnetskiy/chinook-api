import { Router } from 'express';
import GenresController from './genres.controller';
import { validator } from '../../../middlewares/validator';
import { ParamsSchema } from '../../../utils/request.validation';
import { RoleCheck, AuthNCheck } from '../../../middlewares/auth.check';
import { CreateGenreSchema, UpdateGenreSchema } from './genres.schema';

const router = Router();

router.post(
  '/',
  AuthNCheck,
  RoleCheck(['ADMIN', 'EMPLOYEE']),
  validator({ body: CreateGenreSchema }),
  GenresController.createGenre,
);

router.get('/', GenresController.getAllGenres);
router.get(
  '/:id',
  validator({ params: ParamsSchema }),
  GenresController.getGenre,
);

router.patch(
  '/:id',
  AuthNCheck,
  RoleCheck(['ADMIN', 'EMPLOYEE']),
  validator({ params: ParamsSchema }),
  validator({ body: UpdateGenreSchema }),
  GenresController.updateGenre,
);

router.delete(
  '/:id',
  AuthNCheck,
  RoleCheck(['ADMIN', 'EMPLOYEE']),
  validator({ params: ParamsSchema }),
  GenresController.deleteGenre,
);

export default router;
