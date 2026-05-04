import { z } from 'zod';

export const MeSchema = z.object({
  userId: z.number().int(),
  role: z.string(),
  customerId: z.number().int(),
  employeeId: z.number().int(),
});

export const MeUpdateSchema = z
  .object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    postalCode: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    fax: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type MeType = z.infer<typeof MeSchema>;
export type MeUpdType = z.infer<typeof MeUpdateSchema>;
