import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { AdminGuard } from "src/authentication/admin.guard";
import { SessionGuard } from "src/authentication/session.guard";
import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import {
  ValidatedCreateSeriesTypeInput,
  ValidatedUpdateSeriesTypeInput,
} from "./series-type.input";
import { SeriesTypeService } from "./series-type.service";

@Resolver("SeriesType")
export class SeriesTypeResolver {
  constructor(private readonly seriesTypeService: SeriesTypeService) {}

  @Query()
  @UseGuards(SessionGuard)
  async seriesTypes() {
    return this.seriesTypeService.getAll();
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async createSeriesType(@Args("input") input: ValidatedCreateSeriesTypeInput) {
    return this.seriesTypeService.create({ ...input });
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async updateSeriesType(
    @Args("id") id: string,
    @Args("input") input: ValidatedUpdateSeriesTypeInput,
  ) {
    const data = convertNullToUndefined({ ...input });
    return this.seriesTypeService.update(id, data);
  }

  @Mutation()
  @UseGuards(AdminGuard)
  async deleteSeriesType(@Args("id") id: string) {
    return this.seriesTypeService.delete(id);
  }
}
