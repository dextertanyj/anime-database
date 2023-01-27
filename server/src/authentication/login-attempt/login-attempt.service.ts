import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/core/prisma/prisma.service";

const ACCOUNT_LOCK_THRESHOLD = 10;

@Injectable()
export class LoginAttemptService {
	constructor(private prisma: PrismaService) {}

	async isLocked(email: string) {
		const attempts = await this.prisma.loginAttempt.findMany({
			where: {
				user: { email: email },
			},
			orderBy: {
				createdAt: "desc",
			},
			take: ACCOUNT_LOCK_THRESHOLD,
		});
		if (
			attempts.length == 0 ||
			attempts[0].success ||
			attempts.length < ACCOUNT_LOCK_THRESHOLD
		) {
			return false;
		}
		for (let idx = 0; idx < attempts.length; idx++) {
			if (attempts[idx].success) {
				return false;
			}
		}
		return true;
	}

	async record(data: {
		email: string;
		ipAddress: string;
		isSuccessful: boolean;
	}) {
		await this.prisma.loginAttempt.create({
			data: {
				user: {
					connect: {
						email: data.email,
					},
				},
				ipAddress: data.ipAddress,
				success: data.isSuccessful,
			},
		});
	}
}
