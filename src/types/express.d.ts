import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: {
        userId: number;
        role: string;
        customerId: number;
        employeeId: number;
      };
    }
  }
}
