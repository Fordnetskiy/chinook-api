import { prisma } from '../../config/db';
import RedisClient from '../../config/redis';
import { TRegister, TLogin } from './auth.schema';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

class AuthService {
  private readonly SALT_ROUNDS: number = 12;

  register = async (data: TRegister) => {
    const { email, password } = data;

    const checkEmail = await prisma.users.findUnique({
      where: { email },
    });

    if (checkEmail) {
      throw createError(409, 'This Email already exists', {
        description: `Email: ${email} already taken`,
      });
    }

    const hashedPassword: string = await bcrypt.hash(
      password,
      this.SALT_ROUNDS,
    );

    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          first_name: 'John',
          last_name: 'Doe',
          email,
        },
      });

      const user = await tx.users.create({
        data: {
          email,
          password_hash: hashedPassword,
          customer_id: customer.customer_id,
        },
        select: {
          id: true,
          email: true,
          role: true,
          created_at: true,
        },
      });

      return { user };
    });
  };

  login = async (data: TLogin) => {
    const { email, password } = data;

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        password_hash: true,
        role: true,
        customer_id: true,
        employee_id: true,
      },
    });

    if (!user) {
      throw createError(401, 'Invalid credentials', {
        description: 'Invalid Email or Password',
      });
    }

    const passwordCheck = await bcrypt.compare(password, user.password_hash);
    if (!passwordCheck) {
      throw createError(401, 'Invalid credentials', {
        description: 'Invalid Email or Password',
      });
    }

    const token: string = crypto.randomBytes(32).toString('hex');

    await RedisClient.set(
      `access:${token}`,
      JSON.stringify({
        userId: user.id,
        role: user.role,
        customerId: user.customer_id,
        employeeId: user.employee_id,
      }),
      { EX: 60 * 15 },
    );

    return token;
  };

  logout = async (token: string | undefined) => {
    if (!token) {
      throw createError(401, 'Token not provided');
    }
    return await RedisClient.del(`access:${token}`);
  };
}

export default new AuthService();
