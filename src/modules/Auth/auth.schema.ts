import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email({ message: 'Invalid Email' }).toLowerCase(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(64, { message: 'Password must be at least 64 characters' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Password must contain at least one letter and one number',
    }),
});
export const LoginSchema = z.object({
  email: z.email({ message: 'Invalid Email' }).toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type TRegister = z.infer<typeof RegisterSchema>;
export type TLogin = z.infer<typeof LoginSchema>;
