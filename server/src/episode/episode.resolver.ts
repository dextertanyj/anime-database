import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Episode } from "@prisma/client";

import { MemberGuard } from "src/authentication/member.guard";
import { SessionGuard } from "src/authentication/session.guard";
import { convertNullToUndefined } from "src/common/utilities/type.utilities";
import { FileService } from "src/file/file.service";
import { SeriesService } from "src/series/series.service";

import { ValidatedCreateEpisodeInput, ValidatedUpdateEpisodeInput } from "./episode.input";
import { EpisodeService } from "./episode.service";

@Resolver("Episode")
export class EpisodeResolver {
  constructor(
    private readonly episodeService: EpisodeService,
    private readonly fileService: FileService,
    private readonly seriesService: SeriesService,
  ) {}

  @Query()
  @UseGuards(SessionGuard)
  async episode(@Args("id") id: string) {
    return this.episodeService.getById(id);
  }

  @Query()
  @UseGuards(SessionGuard)
  async episodes() {
    return this.episodeService.getAll();
  }

  @Mutation()
  @UseGuards(MemberGuard)
  async createEpisode(@Args("input") input: ValidatedCreateEpisodeInput) {
    const { series: seriesId, ...rest } = input;
    return this.episodeService.create(seriesId, rest);
  }

  @Mutation()
  @UseGuards(MemberGuard)
  async updateEpisode(@Args("id") id: string, @Args("input") input: ValidatedUpdateEpisodeInput) {
    const data = convertNullToUndefined({ ...input });
    // TODO: Enable API support for moving episodes
    if (data.series) {
      throw "Not Yet Supported";
    }
    return this.episodeService.update(id, { ...data });
  }

  @Mutation()
  @UseGuards(MemberGuard)
  async deleteEpisode(@Args("id") id: string) {
    return (await this.episodeService.delete(id)).id;
  }

  @ResolveField()
  async series(@Parent() episode: Episode) {
    return this.seriesService.getByEpisode(episode.id);
  }

  @ResolveField()
  async files(@Parent() episode: Episode) {
    return this.fileService.getByEpisode(episode.id);
  }
}
