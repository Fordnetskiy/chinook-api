import { prisma } from '../../../config/db';
import createError from 'http-errors';
import { track } from '@prisma/client';
import { CreateTrackDTO, UpdateTrackDTO } from './tracks.schema';
import { Query } from '../../../utils/request.validation';

class TracksService {
  createTrack = async (body: CreateTrackDTO): Promise<track> => {
    return prisma.track.create({ data: { ...body } });
  };

  getAll = async (query: Query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [tracks, totalCount] = await Promise.all([
      prisma.track.findMany({
        skip: skip,
        take: limit,
      }),
      prisma.track.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: tracks,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  };

  getTrack = async (id: number) => {
    const track = await prisma.track.findUnique({
      where: { track_id: id },
    });

    if (!track) {
      throw createError(404, 'Track not found', {
        description: `Track with ID - ${id} not found`,
      });
    }

    return track;
  };

  updateTrack = async (id: number, body: UpdateTrackDTO) => {
    const trackExists = await prisma.track.findUnique({
      where: { track_id: id },
    });

    if (!trackExists) {
      throw createError(404, 'Track not found', {
        description: `Not found track with ID - ${id} for update`,
      });
    }

    return prisma.track.update({
      where: { track_id: id },
      data: { ...body },
    });
  };

  deleteTrack = async (id: number) => {
    const trackExists = await prisma.track.findUnique({
      where: { track_id: id },
    });

    if (!trackExists) {
      throw createError(404, 'Track not found', {
        description: `Not found track with ID - ${id} for delete`,
      });
    }

    return prisma.track.delete({ where: { track_id: id } });
  };
}

export default new TracksService();
