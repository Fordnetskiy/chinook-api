import MeService from '../../../modules/Me/me.service';
import { prisma } from '../../../config/db';
import { meUpdDtoIn, meUpdDtoOut } from '../../../modules/Me/me.mapper';
import { customer } from '@prisma/client';

jest.mock('../../../config/db.ts', () => ({
  prisma: {
    users: {
      findUnique: jest.fn(),
    },
    customer: {
      update: jest.fn(),
    },
    invoice: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  users: {
    findUnique: jest.Mock;
  };
  customer: {
    update: jest.Mock;
  };
  invoice: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
  };
};

describe('Me module', () => {
  const user = {
    userId: 1,
    role: 'CUSTOMER',
    customerId: 10,
    employeeId: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Get my profile', () => {
    it('should return user profile', async () => {
      const profile = {
        role: 'CUSTOMER',
        id: 1,
        email: 'test@mail.com',
        customer: {
          customer_id: 10,
          first_name: 'John',
          last_name: 'Doe',
          city: 'Kyiv',
          country: 'Ukraine',
        },
      };

      mockedPrisma.users.findUnique.mockResolvedValue(profile);

      const result = await MeService.getMyProfile(user);

      expect(mockedPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: user.userId },
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

      expect(result).toEqual(profile);
    });

    it('should return 404 if user not found', async () => {
      mockedPrisma.users.findUnique.mockResolvedValue(null);

      await expect(MeService.getMyProfile(user)).rejects.toMatchObject({
        status: 404,
        message: 'User not found',
      });

      expect(mockedPrisma.users.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update my profile', () => {
    it('should update profile', async () => {
      const input = {
        firstName: 'Beautiful',
        lastName: 'Name',
        company: 'SuperCo',
        address: 'Bankova',
        city: 'Kyiv',
        state: 'Kyivshchyna',
        country: 'Ukraine',
        postalCode: '2123213',
        phone: '+380777777777',
        fax: 'sadsafklj1',
      };

      const mappedInput = meUpdDtoIn(input);

      mockedPrisma.customer.update.mockResolvedValue(mappedInput);

      const result = await MeService.updateMyProfile(user, input);

      expect(result).toEqual(mappedInput);
    });
  });

  describe('Get my invoice', () => {
    it('should return my invoice', async () => {
      const invoice = {
        invoice_id: 100,
        customer_id: 10,
        invoice_date: '2026-05-21',
        billing_address: 'Soborna',
        billing_city: 'Kyiv',
        billing_state: 'Kyivshchyna',
        billing_country: 'Ukraine',
        billing_postal_code: '2222324',
      };

      mockedPrisma.invoice.findUnique.mockResolvedValue(invoice);

      const result = await MeService.getMyInvoice(user, invoice.invoice_id);

      expect(mockedPrisma.invoice.findUnique).toHaveBeenCalledTimes(1);

      expect(result).toEqual(invoice);
    });

    it('should return 404 if invoice not found', async () => {
      mockedPrisma.invoice.findUnique.mockResolvedValue(null);

      await expect(MeService.getMyInvoice(user, 100)).rejects.toMatchObject({
        status: 404,
        message: 'Invoice not found',
      });

      expect(mockedPrisma.invoice.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('Get my invoices', () => {
    it('should return a list of invoices', async () => {
      const invoices = [
        {
          invoice_id: 100,
          customer_id: 10,
          invoice_date: '2026-05-21',
          billing_address: 'Soborna',
          billing_city: 'Kyiv',
          billing_state: 'Kyivshchyna',
          billing_country: 'Ukraine',
          billing_postal_code: '2222324',
        },
      ];

      mockedPrisma.invoice.findMany.mockResolvedValue(invoices);

      const result = await MeService.getMyInvoices(user);

      expect(result).toEqual(invoices);
    });

    it('should return 404 if list are empty', async () => {
      mockedPrisma.invoice.findMany.mockResolvedValue([]);

      await expect(MeService.getMyInvoices(user)).rejects.toMatchObject({
        status: 404,
        message: 'Invoices not found',
      });

      expect(mockedPrisma.invoice.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mappers', () => {
    it('should transform data from API to DB style', () => {
      const inData = {
        firstName: 'John',
        lastName: 'Doe',
        company: 'SuperCo',
        address: 'Bankova',
        city: 'Kyiv',
        state: 'Kyivshchyna',
        country: 'Ukraine',
        postalCode: '2123213',
        phone: '+380777777777',
        fax: 'sadsafklj1',
      };

      expect(meUpdDtoIn(inData)).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        company: 'SuperCo',
        address: 'Bankova',
        city: 'Kyiv',
        state: 'Kyivshchyna',
        country: 'Ukraine',
        postal_code: '2123213',
        phone: '+380777777777',
        fax: 'sadsafklj1',
      });
    });

    it('should transform data from DB to API style', () => {
      const outData = {
        first_name: 'John',
        last_name: 'Doe',
        company: 'SuperCo',
        address: 'Bankova',
        city: 'Kyiv',
        state: 'Kyivshchyna',
        country: 'Ukraine',
        postal_code: '2123213',
        phone: '+380777777777',
        fax: 'sadsafklj1',
      } as unknown as customer;

      expect(meUpdDtoOut(outData)).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        company: 'SuperCo',
        address: 'Bankova',
        city: 'Kyiv',
        state: 'Kyivshchyna',
        country: 'Ukraine',
        postalCode: '2123213',
        phone: '+380777777777',
        fax: 'sadsafklj1',
      });
    });
  });
});
