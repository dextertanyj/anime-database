import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { ValidatedCreateUserInput } from "./user.input";
import { UserService } from "./user.service";

@Resolver("User")
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query()
	async user(@Args("email") email: string) {
		return this.userService.getByEmail(email);
	}

	@Mutation()
	async createUser(@Args("input") input: ValidatedCreateUserInput) {
		return this.userService.create({ ...input, name: input.name ?? undefined });
	}
}
