import { prisma } from '../../config/db';
import createError from 'http-errors';
import { MeType, MeUpdType } from './me.schema';

class MeService {
  getMyProfile = async (data: MeType) => {
    const { userId } = data;

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        customer: {
          select: {
            customer_id: true,
            first_name: true,
            last_name: true,
            city: true,
            country: true,
          },
        },
      },
    });

    if (!user) {
      throw createError(404, 'User not found', {
        description: `You're not authenticated, please login first`,
      });
    }

    return user;
  };

  updateMyProfile = async (user: MeType | undefined, reqData: MeUpdType) => {
    const { customerId } = user!;

    return prisma.customer.update({
      where: { customer_id: customerId },
      data: reqData,
      // select: {
      //   customer_id: true,
      //   first_name: true,
      //   last_name: true,
      //   city: true,
      //   country: true,
      // },
    });
  };

  getMyInvoices = async (user: MeType) => {
    const customerId = user.customerId;

    const result = await prisma.invoice.findMany({
      where: { customer_id: customerId },
    });

    if (result.length === 0) {
      throw createError(404, 'Invoices not found', {
        description: 'Not found your invoices',
      });
    }

    return result;
  };

  getMyInvoice = async (user: MeType, invoiceId: number) => {
    const customerId = user.customerId;

    const result = await prisma.invoice.findUnique({
      where: { invoice_id: invoiceId, customer_id: customerId },
    });

    if (!result) {
      throw createError(404, 'Invoice not found', {
        description: 'Not found your invoice',
      });
    }

    return result;
  };
}

export default new MeService();
