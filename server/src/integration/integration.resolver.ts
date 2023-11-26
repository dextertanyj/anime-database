import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { SessionGuard } from "src/authentication/session.guard";
import { Integration } from "src/generated/graphql";

import { AniDBService } from "./anidb/anidb.service";

@Resolver()
export class IntegrationResolver {
  constructor(private readonly aniDBService: AniDBService) {}

  @Query()
  @UseGuards(SessionGuard)
  async integrations() {
    const integrations: Integration[] = [];
    if (await this.aniDBService.isConfigured()) {
      integrations.push(Integration.ANIDB);
    }
    return integrations;
  }

  @Query()
  @UseGuards(SessionGuard)
  async searchIntegration(@Args("integration") integration: Integration, @Args("id") id: string) {
    switch (integration) {
      case Integration.ANIDB:
        return await this.aniDBService.search(id);
    }
  }
}
