import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { compareSync, hashSync } from "bcrypt";

import { Constants } from "src/common/constants/constants";
import { EntityNotFoundError } from "src/common/errors/entity-not-found.error";
import { ForbiddenError } from "src/common/errors/forbidden.error";
import { UniqueConstraintViolationError } from "src/common/errors/unique-constraint-violation.error";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Role } from "src/generated/graphql";

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	async getByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});
	}

	async create(data: {
		email: string;
		name?: string;
		password: string;
		role: Role;
	}): Promise<User> {
		try {
			return await this.prisma.user.create({
				data: {
					...data,
					email: data.email.toLowerCase(),
					password: hashSync(data.password, SALT_ROUNDS),
				},
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.UNIQUE_CONSTRAINT_ERROR) {
				throw new UniqueConstraintViolationError(
					`User email already in use. (Email: ${data.email})`,
				);
			}
			throw e;
		}
	}

	async update(
		email: string,
		data: {
			email?: string;
			name?: string | null;
			role?: Role;
		},
	): Promise<User> {
		try {
			return await this.prisma.user.update({
				where: { email },
				data,
			});
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError();
			}
			throw e;
		}
	}

	async updatePassword(
		email: string,
		data: { oldPassword: string; newPassword: string },
	): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			throw new EntityNotFoundError();
		}
		if (!compareSync(data.oldPassword, user.password)) {
			throw new ForbiddenError();
		}
		return await this.prisma.user.update({
			where: { email },
			data: { password: hashSync(data.newPassword, SALT_ROUNDS) },
		});
	}

	async delete(email: string): Promise<User> {
		try {
			return await this.prisma.user.delete({ where: { email } });
		} catch (e: unknown) {
			if (!(e instanceof PrismaClientKnownRequestError)) {
				throw e;
			}
			if (e.code === Constants.Prisma.ENTITY_NOT_FOUND) {
				throw new EntityNotFoundError();
			}
			throw e;
		}
	}
}
