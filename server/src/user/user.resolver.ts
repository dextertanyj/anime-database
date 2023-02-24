import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AdminGuard } from "src/authentication/admin.guard";
import { SessionGuard } from "src/authentication/session.guard";
import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import { ValidatedCreateUserInput, ValidatedUpdateUserInput } from "./user.input";
import { UserService } from "./user.service";

@Resolver("User")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  @UseGuards(SessionGuard)
  async user(@Args("email") email: string) {
    return this.userService.getByEmail(email);
  }

  @Query()
  @UseGuards(AdminGuard)
  async users() {
    return this.userService.getAll();
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async createUser(@Args("input") input: ValidatedCreateUserInput) {
    return await this.userService.create({
      ...input,
      name: input.name ?? undefined,
    });
  }

  @Mutation()
  @UseGuards(SessionGuard)
  async updateUser(@Args("email") email: string, @Args("input") input: ValidatedUpdateUserInput) {
    // TODO: Access control for member and guests.
    const data = convertNullToUndefined({ ...input });
    return this.userService.update(email, data);
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async deleteUser(@Args("email") email: string) {
    return (await this.userService.delete(email)).id;
  }
}
