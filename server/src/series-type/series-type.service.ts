import assert from "assert";

import { Injectable } from "@nestjs/common";
import { Prisma, SeriesType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { StateMismatchError } from "src/common/errors/state-mismatch.error";
import { UniqueConstraintViolationError } from "src/common/errors/unique-constraint-violation.error";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class SeriesTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<SeriesType[]> {
    return this.prisma.seriesType.findMany();
  }

  async getById(id: string): Promise<SeriesType | null> {
    return this.prisma.seriesType.findUnique({
      where: { id },
    });
  }

  async create(data: { type: string; singular: boolean }): Promise<SeriesType> {
    try {
      return await this.prisma.seriesType.create({ data });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
        throw new UniqueConstraintViolationError(`SeriesType already exists. (Type: ${data.type})`);
      }
      throw e;
    }
  }

  async update(id: string, data: { type?: string; singular?: boolean }): Promise<SeriesType> {
    const existing = await this.prisma.seriesType.findUnique({ where: { id } });
    if (!existing) {
      throw new EntityNotFoundError(`SeriesType not found. (ID: ${id})`);
    }
    try {
      return await this.prisma.$transaction(async (tx) => {
        if (data.singular && data.singular !== existing.singular) {
          const invalids = await tx.episode.groupBy({
            where: { series: { type: { id } } },
            by: ["seriesId"],
            _count: { id: true },
            having: { id: { _count: { gt: 1 } } },
          });
          if (invalids.length > 0) {
            throw new StateMismatchError("Existing multi-episode series.");
          }
        }
        const result = await tx.seriesType.update({
          where: { id },
          data,
        });
        if (data.singular !== undefined && data.singular !== existing.singular) {
          await this.updateEpisodeNumbers(tx, id, data.singular);
        }
        return result;
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
        assert(data.type);
        throw new UniqueConstraintViolationError(`SeriesType already exists. (Type: ${data.type})`);
      }
      if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
        throw new EntityNotFoundError(`SeriesType not found. (ID: ${id})`);
      }
      throw e;
    }
  }

  async delete(id: string): Promise<SeriesType> {
    try {
      return await this.prisma.seriesType.delete({
        where: { id },
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
        throw new EntityNotFoundError(`SeriesType not found. (ID: ${id})`);
      }
      throw e;
    }
  }

  async updateEpisodeNumbers(
    tx: Prisma.TransactionClient,
    seriesTypeId: string,
    singular: boolean,
  ) {
    // All series have at most one episode.
    return tx.episode.updateMany({
      where: {
        series: {
          seriesTypeId,
        },
      },
      data: { episodeNumber: singular ? 0 : 1 },
    });
  }
}
