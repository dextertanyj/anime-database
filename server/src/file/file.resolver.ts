import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { File } from "@prisma/client";

import { MemberGuard } from "src/authentication/member.guard";
import { SessionGuard } from "src/authentication/session.guard";
import { convertNullToUndefined } from "src/common/utilities/type.utilities";
import { EpisodeService } from "src/episode/episode.service";
import { FileSourceService } from "src/file-source/file-source.service";

import { ValidatedCreateFileInput, ValidatedUpdateFileInput } from "./file.input";
import { FileService } from "./file.service";

@Resolver("File")
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
    private readonly episodeService: EpisodeService,
    private readonly fileSourceService: FileSourceService,
  ) {}

  @Query()
  @UseGuards(SessionGuard)
  async file(@Args("id") id: string) {
    return this.fileService.getById(id);
  }

  @Query()
  @UseGuards(SessionGuard)
  async files() {
    return this.fileService.getAll();
  }

  @Mutation()
  @UseGuards(MemberGuard)
  async createFile(@Args("input") input: ValidatedCreateFileInput) {
    const { episode: episodeId, source: fileSourceId, ...rest } = input;
    return this.fileService.create(episodeId, {
      ...rest,
      fileSourceId,
    });
  }

  @Mutation()
  @UseGuards(MemberGuard)
  async updateFile(@Args("id") id: string, @Args("input") input: ValidatedUpdateFileInput) {
    const data = convertNullToUndefined({ ...input });
    if (data.episode) {
      throw "Not Yet Supported";
    }
    return this.fileService.update(id, {
      ...data,
      fileSourceId: data.source,
    });
  }

  @Mutation()
  @UseGuards(MemberGuard)
  async deleteFile(@Args("id") id: string) {
    return (await this.fileService.delete(id)).id;
  }

  @ResolveField()
  async episode(@Parent() file: File) {
    return this.episodeService.getByFile(file.id);
  }

  @ResolveField()
  async source(@Parent() file: File) {
    return this.fileSourceService.getById(file.fileSourceId);
  }
}
