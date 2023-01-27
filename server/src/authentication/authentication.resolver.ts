import { UseGuards } from "@nestjs/common";
import { Mutation, Query, Resolver } from "@nestjs/graphql";

import { User } from "src/common/decorators/user.decorator";
import { Role, UserSession } from "src/generated/graphql";

import { LocalGuard } from "./local.guard";
import { SessionGuard } from "./session.guard";

@Resolver()
export class AuthenticationResolver {
	@Query()
	@UseGuards(SessionGuard)
	async session(@User() user: Express.User): Promise<UserSession | null> {
		return { ...user, role: user.role as Role };
	}

	@Mutation()
	@UseGuards(LocalGuard)
	async createSession(@User() user: Express.User): Promise<UserSession> {
		return { ...user, role: user.role as Role };
	}

	@Mutation()
	async deleteSession() {
		return true;
	}
}
