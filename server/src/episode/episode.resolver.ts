import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { convertNullToUndefined } from "src/common/utilities/type.utilities";

import {
	ValidatedCreateEpisodeInput,
	ValidatedUpdateEpisodeInput,
} from "./episode.input";
import { EpisodeService } from "./episode.service";

@Resolver("Episode")
export class EpisodeResolver {
	constructor(private readonly episodeService: EpisodeService) {}

	@Query()
	async episode(@Args("id") id: string) {
		return this.episodeService.getById(id);
	}

	@Query()
	async episodes() {
		return this.episodeService.getAll();
	}

	@Mutation()
	async createEpisode(@Args("input") input: ValidatedCreateEpisodeInput) {
		const { series: seriesId, ...rest } = input;
		return this.episodeService.create(seriesId, rest);
	}

	@Mutation()
	async updateEpisode(
		@Args("id") id: string,
		@Args("input") input: ValidatedUpdateEpisodeInput,
	) {
		const data = convertNullToUndefined({ ...input });
		// TODO: Enable API support for moving episodes
		if (data.series) {
			throw "Not Yet Supported";
		}
		return this.episodeService.update(id, { ...data });
	}

	@Mutation()
	async deleteEpisode(@Args("id") id: string) {
		return this.episodeService.delete(id);
	}
}
