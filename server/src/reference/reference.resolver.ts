import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { SessionGuard } from "src/authentication/session.guard";

import { ReferenceService } from "./reference.service";

@Resolver()
export class ReferenceResolver {
  constructor(private readonly referenceService: ReferenceService) {}

  @Query()
  @UseGuards(SessionGuard)
  async referenceSources() {
    return this.referenceService.getSources();
  }
}
