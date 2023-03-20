import assert from "assert";

import { Injectable } from "@nestjs/common";
import { Episode } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { StateMismatchError } from "src/common/errors/state-mismatch.error";
import { UniqueConstraintViolationError } from "src/common/errors/unique-constraint-violation.error";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Episode[]> {
    return this.prisma.episode.findMany();
  }

  async getById(id: string): Promise<Episode | null> {
    return this.prisma.episode.findUnique({
      where: { id },
    });
  }

  async getBySeries(seriesId: string): Promise<Episode[]> {
    return this.prisma.episode.findMany({
      where: { seriesId },
    });
  }

  async getByFile(fileId: string): Promise<Episode> {
    const episodes = await this.prisma.episode.findMany({
      where: { files: { some: { id: fileId } } },
    });
    assert(episodes.length === 1);
    return episodes[0];
  }

  async countBySeries(seriesId: string): Promise<number> {
    return await this.prisma.episode.count({
      where: { seriesId },
    });
  }

  async create(
    seriesId: string,
    data: {
      title: string;
      alternativeTitles: string[];
      episodeNumber?: number | null;
      remarks?: string | null;
    },
  ): Promise<Episode> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const series = await tx.series.findUnique({
          where: { id: seriesId },
          include: { type: true },
        });
        if (!series) {
          throw new EntityNotFoundError(`Series does not exist. (Series ID: ${seriesId})`);
        }
        if (series.type.singular && data.episodeNumber) {
          throw new StateMismatchError(
            `Episode number should not be specified for single episode series.`,
          );
        }
        if (!series.type.singular && !data.episodeNumber) {
          throw new StateMismatchError(
            `Episode number should be specified for multi-episode series.`,
          );
        }
        return await tx.episode.create({
          data: { ...data, seriesId, episodeNumber: data.episodeNumber || 0 },
        });
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.FOREIGN_KEY_ERROR) {
        throw new EntityNotFoundError(`Series does not exist. (Series ID: ${seriesId})`);
      }
      if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
        throw new UniqueConstraintViolationError(
          `Episode number already in use. (Episode number: ${data.episodeNumber || 0})`,
        );
      }
      throw e;
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      alternativeTitles?: string[];
      episodeNumber?: number | null;
      remarks?: string | null;
    },
  ): Promise<Episode> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const episode = await tx.episode.findUnique({
          where: { id },
          include: { series: { include: { type: true } } },
        });
        if (!episode) {
          throw new EntityNotFoundError(`Episode not found. (ID: ${id})`);
        }
        if (episode.series.type.singular && data.episodeNumber) {
          throw new StateMismatchError(
            `Episode number should not be specified for single episode series.`,
          );
        }
        if (!episode.series.type.singular && data.episodeNumber === null) {
          throw new StateMismatchError(
            `Episode number should be specified for multi-episode series.`,
          );
        }
        return await tx.episode.update({
          where: { id },
          data: { ...data, episodeNumber: data.episodeNumber === null ? 0 : data.episodeNumber },
        });
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
        throw new EntityNotFoundError(`Episode not found. (ID: ${id})`);
      }
      if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
        throw new UniqueConstraintViolationError(
          `Episode number already in use. (Episode number: ${data.episodeNumber || 0})`,
        );
      }
      throw e;
    }
  }

  async delete(id: string): Promise<Episode> {
    try {
      return await this.prisma.episode.delete({
        where: { id },
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
        throw new EntityNotFoundError(`Episode not found. (ID: ${id})`);
      }
      throw e;
    }
  }
}
