import AuthService from '../../../modules/Auth/auth.service';
import { prisma } from '../../../config/db';
import RedisClient from '../../../config/redis';
import bcrypt from 'bcrypt';

jest.mock('../../../config/db', () => ({
  prisma: {
    users: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('../../../config/redis', () => ({
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockedPrisma = prisma as unknown as {
  users: {
    findUnique: jest.Mock;
  };
  $transaction: jest.Mock;
};
const mockedRedis = RedisClient as unknown as {
  set: jest.Mock;
  get: jest.Mock;
  del: jest.Mock;
};
const mockedBcrypt = bcrypt as unknown as {
  hash: jest.Mock;
  compare: jest.Mock;
};

describe('Auth module', () => {
  const input = {
    email: 'test1@email.com',
    password: 'password12345',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Register', () => {
    it('should create a new account', async () => {
      const createdCustomer = {
        customer_id: 10,
        first_name: 'John',
        last_name: 'Doe',
        email: 'test1@email.com',
      };

      const createdUser = {
        id: 1,
        email: 'test1@email.com',
        role: 'CUSTOMER',
        created_at: new Date('2026-05-20'),
      };

      const tx = {
        customer: {
          create: jest.fn().mockResolvedValue(createdCustomer),
        },
        users: {
          create: jest.fn().mockResolvedValue(createdUser),
        },
      };

      mockedPrisma.users.findUnique.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed-password');
      mockedPrisma.$transaction.mockImplementation(async (cb) => {
        return cb(tx);
      });

      const result = await AuthService.register(input);

      expect(mockedPrisma.users.findUnique).toHaveBeenCalledWith({
        where: {
          email: input.email,
        },
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(input.password, 12);

      expect(mockedPrisma.$transaction).toHaveBeenCalledTimes(1);

      expect(tx.customer.create).toHaveBeenCalledWith({
        data: {
          first_name: 'John',
          last_name: 'Doe',
          email: input.email,
        },
      });

      expect(tx.users.create).toHaveBeenCalledWith({
        data: {
          email: input.email,
          password_hash: 'hashed-password',
          customer_id: createdCustomer.customer_id,
        },
        select: {
          id: true,
          email: true,
          role: true,
          created_at: true,
        },
      });

      expect(result).toEqual({
        user: createdUser,
      });
    });

    it('should throw an error, when email already exists', async () => {
      const existingUser = {
        email: input.email,
        password: 'abcd1213123',
      };

      mockedPrisma.users.findUnique.mockResolvedValue(existingUser);

      await expect(AuthService.register(input)).rejects.toMatchObject({
        status: 409,
        message: 'This Email already exists',
      });

      expect(mockedPrisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: input.email },
      });

      expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('Login', () => {
    const input = {
      email: 'test@mail.com',
      password: 'password12345',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should login successfully and return token', async () => {
      const fakeUser = {
        id: 1,
        password_hash: 'hashed-password',
        role: 'CUSTOMER',
        customer_id: 10,
        employee_id: null,
      };

      mockedPrisma.users.findUnique.mockResolvedValue(fakeUser);

      mockedBcrypt.compare.mockResolvedValue(true);

      mockedRedis.set.mockResolvedValue('OK');

      const token = await AuthService.login(input);

      expect(mockedPrisma.users.findUnique).toHaveBeenCalledWith({
        where: {
          email: input.email,
        },
        select: {
          id: true,
          password_hash: true,
          role: true,
          customer_id: true,
          employee_id: true,
        },
      });

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        input.password,
        fakeUser.password_hash,
      );

      expect(mockedRedis.set).toHaveBeenCalledTimes(1);

      expect(mockedRedis.set).toHaveBeenCalledWith(
        expect.stringContaining('access:'),
        JSON.stringify({
          userId: fakeUser.id,
          role: fakeUser.role,
          customerId: fakeUser.customer_id,
          employeeId: fakeUser.employee_id,
        }),
        { EX: 60 * 15 },
      );

      expect(token).toEqual(expect.any(String));
    });

    it('should throw error if user does not exists', async () => {
      mockedPrisma.users.findUnique.mockResolvedValue(null);

      await expect(AuthService.login(input)).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();

      expect(mockedRedis.set).not.toHaveBeenCalled();
    });

    it('should throw error if password is invalid', async () => {
      const fakeUser = {
        id: 1,
        password_hash: 'hashed-password',
        role: 'CUSTOMER',
        customer_id: 10,
        employee_id: null,
      };

      mockedPrisma.users.findUnique.mockResolvedValue(fakeUser);

      mockedBcrypt.compare.mockResolvedValue(false);

      await expect(AuthService.login(input)).rejects.toMatchObject({
        status: 401,
        message: 'Invalid credentials',
      });

      expect(mockedRedis.set).not.toHaveBeenCalled();
    });
  });

  describe('Logout', () => {
    const token = 'super-strong-token';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should remove opaque token from redis and return result', async () => {
      mockedRedis.del.mockResolvedValue(1);

      const result = await AuthService.logout(token);

      expect(mockedRedis.del).toHaveBeenCalledWith(`access:${token}`);

      expect(result).toBe(1);
    });

    it('should throw 401 if token is not provided', async () => {
      const token = undefined;

      await expect(AuthService.logout(token)).rejects.toMatchObject({
        status: 401,
        message: 'Token not provided',
      });

      expect(mockedRedis.del).not.toHaveBeenCalled();
    });
  });
});
