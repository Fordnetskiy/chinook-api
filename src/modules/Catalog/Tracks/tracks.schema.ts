import { z } from 'zod';

export const CreateTrackSchema = z.object({
  bytes: z.number().nullable(),
  name: z.string().min(1),
  album_id: z.number().positive().nullable(),
  media_type_id: z.number().positive(),
  genre_id: z.number().positive().nullable(),
  composer: z.string().nullable(),
  milliseconds: z.number().positive(),
  unit_price: z.number().positive(),
});
export const UpdateTrackSchema = CreateTrackSchema.partial();

export type CreateTrackDTO = z.infer<typeof CreateTrackSchema>;
export type UpdateTrackDTO = z.infer<typeof UpdateTrackSchema>;
