import { z } from 'zod';

export const CreateGenreSchema = z.object({
  name: z.string().min(1),
});
export const UpdateGenreSchema = CreateGenreSchema.partial();

export type CreateGenreDTO = z.infer<typeof CreateGenreSchema>;
export type UpdateGenreDTO = z.infer<typeof UpdateGenreSchema>;
