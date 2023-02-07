import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { FileSource } from "@prisma/client";

import { AdminGuard } from "src/authentication/admin.guard";
import { SessionGuard } from "src/authentication/session.guard";
import { convertNullToUndefined } from "src/common/utilities/type.utilities";
import { FileService } from "src/file/file.service";

import {
	ValidatedCreateFileSourceInput,
	ValidatedUpdateFileSourceInput,
} from "./file-source.input";
import { FileSourceService } from "./file-source.service";

@Resolver("FileSource")
export class FileSourceResolver {
	constructor(
		private readonly fileSourceService: FileSourceService,
		private readonly fileSerivce: FileService,
	) {}

	@Query()
	@UseGuards(SessionGuard)
	async fileSources() {
		return this.fileSourceService.getAll();
	}

	@Mutation()
	@UseGuards(AdminGuard)
	async createFileSource(@Args("input") input: ValidatedCreateFileSourceInput) {
		return this.fileSourceService.create({ ...input });
	}

	@Mutation()
	@UseGuards(AdminGuard)
	async updateFileSource(
		@Args("id") id: string,
		@Args("input") input: ValidatedUpdateFileSourceInput,
	) {
		const data = convertNullToUndefined({ ...input });
		return this.fileSourceService.update(id, data);
	}

	@Mutation()
	@UseGuards(AdminGuard)
	async deleteFileSource(@Args("id") id: string) {
		return this.fileSourceService.delete(id);
	}

	@ResolveField()
	async files(@Parent() fileSource: FileSource) {
		return this.fileSerivce.getByFileSource(fileSource.id);
	}
}
