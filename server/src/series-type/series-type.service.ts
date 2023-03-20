import assert from "assert";

import { Injectable } from "@nestjs/common";
import { SeriesType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
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
    try {
      return await this.prisma.seriesType.update({
        where: { id },
        data,
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
}
