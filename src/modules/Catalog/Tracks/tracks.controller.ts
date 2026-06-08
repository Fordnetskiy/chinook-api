import { Request, Response, NextFunction } from 'express';
import TracksService from './tracks.service';
import { track } from '@prisma/client';
import { Query } from '../../../utils/request.validation';

class TracksController {
  createTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: track = await TracksService.createTrack(req.body);

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  getAllTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as Query;
      const result = await TracksService.getAll(query);

      res.status(200).json({
        status: 'success',
        ...result,
      });
    } catch (e) {
      next(e);
    }
  };

  getTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trackId = Number(req.params.id);
      const result = await TracksService.getTrack(trackId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  updateTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await TracksService.updateTrack(id, req.body);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  deleteTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await TracksService.deleteTrack(id);

      res.status(200).json({
        status: 'success',
        message: `Track with ID - ${id} was successfully deleted`,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default new TracksController();
