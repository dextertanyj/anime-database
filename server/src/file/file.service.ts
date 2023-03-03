import assert from "assert";

import { Injectable } from "@nestjs/common";
import { File } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<File[]> {
    return this.prisma.file.findMany();
  }

  async getById(id: string): Promise<File | null> {
    return this.prisma.file.findUnique({
      where: { id },
    });
  }

  async getByEpisode(episodeId: string): Promise<File[]> {
    return this.prisma.file.findMany({
      where: { episodeId },
    });
  }

  async getByFileSource(fileSourceId: string): Promise<File[]> {
    return this.prisma.file.findMany({
      where: { source: { id: fileSourceId } },
    });
  }

  async getCodecs(): Promise<string[]> {
    const codecs = await this.prisma.file.findMany({
      select: { codec: true },
      distinct: ["codec"],
    });
    return codecs.map((value) => value.codec);
  }

  async create(
    episodeId: string,
    data: {
      path: string;
      checksum: string;
      fileSize: number;
      duration: number;
      resolutionHeight: number;
      resolutionWidth: number;
      codec: string;
      fileSourceId: string;
      remarks?: string | null;
    },
  ): Promise<File> {
    try {
      return await this.prisma.file.create({
        data: { ...data, episodeId: episodeId },
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.FOREIGN_KEY_ERROR) {
        if ((e.meta?.field_name as string | undefined)?.includes("episodeId")) {
          throw new EntityNotFoundError(`Episode does not exist. (Episode ID: ${episodeId})`);
        }
        if ((e.meta?.field_name as string | undefined)?.includes("fileSourceId")) {
          throw new EntityNotFoundError(
            `FileSource does not exist. (Source ID: ${data.fileSourceId})`,
          );
        }
      }
      throw e;
    }
  }

  async update(
    id: string,
    data: {
      path?: string;
      checksum?: string;
      fileSize?: number;
      duration?: number;
      resolutionHeight?: number;
      resolutionWidth?: number;
      codec?: string;
      fileSourceId?: string;
      remarks?: string | null;
    },
  ): Promise<File> {
    try {
      return await this.prisma.file.update({
        where: { id },
        data,
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
        throw new EntityNotFoundError(`File not found. (ID: ${id})`);
      }
      if (e.code === Constants.Prisma.FOREIGN_KEY_ERROR) {
        assert(data.fileSourceId);
        throw new EntityNotFoundError(
          `FileSource does not exist. (Source ID: ${data.fileSourceId})`,
        );
      }
      throw e;
    }
  }

  async delete(id: string): Promise<File> {
    try {
      return await this.prisma.file.delete({
        where: { id },
      });
    } catch (e: unknown) {
      if (!(e instanceof PrismaClientKnownRequestError)) {
        throw e;
      }
      if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
        throw new EntityNotFoundError(`File not found. (ID: ${id})`);
      }
      throw e;
    }
  }
}
