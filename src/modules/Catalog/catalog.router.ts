import { Router } from 'express';
import TracksRoutes from './Tracks/tracks.router';
import GenresRoutes from './Genres/genres.router';

const router = Router();

router.use('/tracks', TracksRoutes);
router.use('/genres', GenresRoutes);

export default router;
