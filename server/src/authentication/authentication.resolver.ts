import { UseGuards } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { Request } from "src/common/decorators/request.decorator";
import { User } from "src/common/decorators/user.decorator";
import { Role, UserSession } from "src/generated/graphql";

import { LocalGuard } from "./local.guard";

@Resolver()
export class AuthenticationResolver {
	constructor(
		@InjectPinoLogger(AuthenticationResolver.name)
		private readonly logger: PinoLogger,
	) {}

	@Query()
	async session(
		@Request() request: Express.Request,
		@User() user: Express.User,
	): Promise<UserSession | null> {
		if (!request.isAuthenticated()) {
			return null;
		}
		return { ...user, role: user.role as Role };
	}

	@Mutation()
	@UseGuards(LocalGuard)
	async createSession(@User() user: Express.User): Promise<UserSession> {
		return { ...user, role: user.role as Role };
	}

	@Mutation()
	async deleteSession(@Request() request: Express.Request) {
		request.logout((error) => {
			if (error) {
				this.logger.warn(error);
			}
		});
		return true;
	}
}
