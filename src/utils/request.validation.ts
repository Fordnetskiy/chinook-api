import { z } from 'zod';

export const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export const ParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Query = z.infer<typeof QuerySchema>;
export type Params = z.infer<typeof ParamsSchema>;
