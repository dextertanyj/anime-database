import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AdminGuard } from "src/authentication/admin.guard";
import { SessionGuard } from "src/authentication/session.guard";
import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import {
  ValidatedCreateWatchStatusInput,
  ValidatedUpdateWatchStatusInput,
} from "./watch-status.input";
import { WatchStatusService } from "./watch-status.service";

@Resolver("WatchStatus")
export class WatchStatusResolver {
  constructor(private readonly watchStatusService: WatchStatusService) {}

  @Query()
  @UseGuards(SessionGuard)
  async watchStatuses() {
    return this.watchStatusService.getAll();
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async createWatchStatus(@Args("input") input: ValidatedCreateWatchStatusInput) {
    return this.watchStatusService.create({ ...input });
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async updateWatchStatus(
    @Args("id") id: string,
    @Args("input") input: ValidatedUpdateWatchStatusInput,
  ) {
    const data = convertNullToUndefined({ ...input });
    return this.watchStatusService.update(id, data);
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async deleteWatchStatus(@Args("id") id: string) {
    return this.watchStatusService.delete(id);
  }
}
