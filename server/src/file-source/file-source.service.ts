import { Injectable } from "@nestjs/common";
import { FileSource } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { UniqueConstraintViolationError } from "src/common/errors/unique-constraint-violation.error";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class FileSourceService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(): Promise<FileSource[]> {
		return this.prisma.fileSource.findMany();
	}

	async getById(id: string): Promise<FileSource | null> {
		return this.prisma.fileSource.findUnique({
			where: { id },
		});
	}

	async create(data: { source: string }): Promise<FileSource> {
		try {
			return await this.prisma.fileSource.create({ data });
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
				throw new UniqueConstraintViolationError(
					`FileSource already exists. (Source: ${data.source})`,
				);
			}
			throw e;
		}
	}

	async update(id: string, data: { source?: string }): Promise<FileSource> {
		try {
			return await this.prisma.fileSource.update({
				where: { id },
				data,
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
				throw new UniqueConstraintViolationError(
					`FileSource already exists. (Source: ${data.source})`,
				);
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError(`FileSource not found. (ID: ${id})`);
			}
			throw e;
		}
	}

	async delete(id: string): Promise<FileSource> {
		try {
			return await this.prisma.fileSource.delete({
				where: { id },
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError(`FileSource not found. (ID: ${id})`);
			}
			throw e;
		}
	}
}
