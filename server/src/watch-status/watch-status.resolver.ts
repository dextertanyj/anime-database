import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

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
	async watchStatuses() {
		return this.watchStatusService.getAll();
	}

	@Mutation()
	async createWatchStatus(
		@Args("input") input: ValidatedCreateWatchStatusInput,
	) {
		return this.watchStatusService.create({ ...input });
	}

	@Mutation()
	async updateWatchStatus(
		@Args("id") id: string,
		@Args("input") input: ValidatedUpdateWatchStatusInput,
	) {
		const data = convertNullToUndefined({ ...input });
		return this.watchStatusService.update(id, data);
	}

	@Mutation()
	async deleteWatchStatus(@Args("id") id: string) {
		return this.watchStatusService.delete(id);
	}
}
