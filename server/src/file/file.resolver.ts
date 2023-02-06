import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import {
	ValidatedCreateFileInput,
	ValidatedUpdateFileInput,
} from "./file.input";
import { FileService } from "./file.service";

@Resolver("File")
export class FileResolver {
	constructor(private readonly fileService: FileService) {}

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
	async updateFile(
		@Args("id") id: string,
		@Args("input") input: ValidatedUpdateFileInput,
	) {
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
}
