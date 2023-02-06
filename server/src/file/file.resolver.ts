import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { File } from "@prisma/client";

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
	async file(@Args("id") id: string) {
		return this.fileService.getById(id);
	}

	@Query()
	async files() {
		return this.fileService.getAll();
	}

	@Mutation()
	async createFile(@Args("input") input: ValidatedCreateFileInput) {
		const { episode: episodeId, source: fileSourceId, ...rest } = input;
		return this.fileService.create(episodeId, {
			...rest,
			fileSourceId,
		});
	}

	@Mutation()
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
	async deleteFile(@Args("id") id: string) {
		return this.fileService.delete(id);
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
