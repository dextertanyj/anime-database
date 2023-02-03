import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import {
	ValidatedCreateFileSourceInput,
	ValidatedUpdateFileSourceInput,
} from "./file-source.input";
import { FileSourceService } from "./file-source.service";

@Resolver("FileSource")
export class FileSourceResolver {
	constructor(private readonly fileSourceService: FileSourceService) {}

	@Query()
	async fileSources() {
		return this.fileSourceService.getAll();
	}

	@Mutation()
	async createFileSource(@Args("input") input: ValidatedCreateFileSourceInput) {
		return this.fileSourceService.create({ ...input });
	}

	@Mutation()
	async updateFileSource(
		@Args("id") id: string,
		@Args("input") input: ValidatedUpdateFileSourceInput,
	) {
		const data = convertNullToUndefined({ ...input });
		return this.fileSourceService.update(id, data);
	}

	@Mutation()
	async deleteFileSource(@Args("id") id: string) {
		return this.fileSourceService.delete(id);
	}
}
