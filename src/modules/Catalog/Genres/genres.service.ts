import { prisma } from '../../../config/db';
import createError from 'http-errors';
import { genre } from '@prisma/client';
import { CreateGenreDTO, UpdateGenreDTO } from './genres.schema';
import { Query } from '../../../utils/request.validation';

class GenresService {
  createGenre = async (body: CreateGenreDTO): Promise<genre> => {
    return prisma.genre.create({ data: { ...body } });
  };

  getAll = async (query: Query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [genres, totalCount] = await Promise.all([
      prisma.genre.findMany({
        skip: skip,
        take: limit,
      }),
      prisma.genre.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: genres,
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

  getGenre = async (id: number) => {
    const genre = await prisma.genre.findUnique({
      where: { genre_id: id },
    });

    if (!genre) {
      throw createError(404, 'Genre not found', {
        description: `Genre with ID - ${id} not found`,
      });
    }

    return genre;
  };

  updateGenre = async (id: number, body: UpdateGenreDTO) => {
    const genreExists = await prisma.genre.findUnique({
      where: { genre_id: id },
    });

    if (!genreExists) {
      throw createError(404, 'Genre not found', {
        description: `Not found genre with ID - ${id} for update`,
      });
    }

    return prisma.genre.update({
      where: { genre_id: id },
      data: { ...body },
    });
  };

  deleteGenre = async (id: number) => {
    const genreExists = await prisma.genre.findUnique({
      where: { genre_id: id },
    });

    if (!genreExists) {
      throw createError(404, 'Genre not found', {
        description: `Not found genre with ID - ${id} for delete`,
      });
    }

    return prisma.genre.delete({ where: { genre_id: id } });
  };
}

export default new GenresService();
