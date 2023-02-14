import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { ValidatedSetupInput } from "./setup.input";
import { SetupService } from "./setup.service";

@Resolver()
export class SetupResolver {
  constructor(private readonly setupService: SetupService) {}

  @Query("setup")
  async setupQuery() {
    return this.setupService.isSetup();
  }

  @Mutation("setup")
  async setupMutation(@Args("input") input: ValidatedSetupInput) {
    return !!(await this.setupService.setup({ ...input }));
  }
}
