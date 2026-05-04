import { Request, Response, NextFunction } from 'express';
import MeService from './me.service';
import { meUpdDtoIn, meUpdDtoOut } from './me.mapper';

class MeController {
  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: Request['user'] = req.user;
      const result = await MeService.getMyProfile(user!);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: Request['user'] = req.user;
      const body = meUpdDtoIn(req.body);

      const updProfile = await MeService.updateMyProfile(user, body);

      const result = meUpdDtoOut(updProfile);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  getMyInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: Request['user'] = req.user;
      const result = await MeService.getMyInvoices(user!);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  getMyInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceId: number = Number(req.params.id);
      const user: Request['user'] = req.user;

      const result = await MeService.getMyInvoice(user!, invoiceId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };
}

export default new MeController();
