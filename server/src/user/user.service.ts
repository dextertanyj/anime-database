import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { hashSync } from "bcrypt";

import { Constants } from "src/common/constants/constants";
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
	}): Promise<User | null> {
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
				return null;
			}
			throw e;
		}
	}
}
