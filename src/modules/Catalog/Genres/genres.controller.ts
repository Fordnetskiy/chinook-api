import { Request, Response, NextFunction } from 'express';
import GenresService from './genres.service';
import { genre } from '@prisma/client';
import { Query } from '../../../utils/request.validation';

class GenresController {
  createGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: genre = await GenresService.createGenre(req.body);

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  getAllGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as Query;
      const result = await GenresService.getAll(query);

      res.status(200).json({
        status: 'success',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  };

  getGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genreId = Number(req.params.id);
      const result = await GenresService.getGenre(genreId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  updateGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await GenresService.updateGenre(id, req.body);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  deleteGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await GenresService.deleteGenre(id);

      res.status(200).json({
        status: 'success',
        message: `Genre with ID - ${id} was successfully deleted`,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default new GenresController();
