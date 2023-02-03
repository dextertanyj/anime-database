import { Injectable } from "@nestjs/common";
import { WatchStatus } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { UniqueConstraintViolationError } from "src/common/errors/unique-constraint-violation.error";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class WatchStatusService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll(): Promise<WatchStatus[]> {
		return this.prisma.watchStatus.findMany();
	}

	async create(data: { status: string }): Promise<WatchStatus> {
		try {
			return await this.prisma.watchStatus.create({ data });
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
				throw new UniqueConstraintViolationError(
					`WatchStatus already exists. (Status: ${data.status})`,
				);
			}
			throw e;
		}
	}

	async update(id: string, data: { status?: string }): Promise<WatchStatus> {
		try {
			return await this.prisma.watchStatus.update({
				where: { id },
				data,
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
				throw new UniqueConstraintViolationError(
					`WatchStatus already exists. (Status: ${data.status})`,
				);
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError(`WatchStatus not found. (ID: ${id})`);
			}
			throw e;
		}
	}

	async delete(id: string): Promise<WatchStatus> {
		try {
			return await this.prisma.watchStatus.delete({
				where: { id },
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError(`WatchStatus not found. (ID: ${id})`);
			}
			throw e;
		}
	}
}
