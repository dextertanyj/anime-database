import { ConflictException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import {
	ValidatedCreateUserInput,
	ValidatedUpdateUserInput,
} from "./user.input";
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
		const user = await this.userService.create({
			...input,
			name: input.name ?? undefined,
		});
		if (!user) {
			throw new ConflictException();
		}
		return user;
	}

	@Mutation()
	async updateUser(
		@Args("email") email: string,
		@Args("input") input: ValidatedUpdateUserInput,
	) {
		const data = convertNullToUndefined({ ...input });
		return this.userService.update(email, data);
	}

	@Mutation()
	async deleteUser(@Args("email") email: string) {
		return this.userService.delete(email);
	}
}
