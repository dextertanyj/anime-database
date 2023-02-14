import assert from "assert";

import { Injectable } from "@nestjs/common";
import { Episode } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
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

  async create(
    seriesId: string,
    data: {
      title: string;
      alternativeTitles: string[];
      episodeNumber: number;
      remarks?: string | null;
    },
  ): Promise<Episode> {
    try {
      return await this.prisma.episode.create({
        data: { ...data, seriesId },
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.FOREIGN_KEY_ERROR) {
        throw new EntityNotFoundError(`Series does not exist. (Series ID: ${seriesId})`);
      }
      throw e;
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      alternativeTitles?: string[];
      episodeNumber?: number;
      remarks?: string | null;
    },
  ): Promise<Episode> {
    try {
      return await this.prisma.episode.update({
        where: { id },
        data,
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

  async delete(id: string): Promise<string> {
    try {
      const episode = await this.prisma.episode.delete({
        where: { id },
      });
      return episode.id;
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
