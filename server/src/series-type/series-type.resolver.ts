import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

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
	async seriesTypes() {
		return this.seriesTypeService.getAll();
	}

	@Mutation()
	async createSeriesType(@Args("input") input: ValidatedCreateSeriesTypeInput) {
		return this.seriesTypeService.create({ ...input });
	}

	@Mutation()
	async updateSeriesType(
		@Args("id") id: string,
		@Args("input") input: ValidatedUpdateSeriesTypeInput,
	) {
		const data = convertNullToUndefined({ ...input });
		return this.seriesTypeService.update(id, data);
	}

	@Mutation()
	async deleteSeriesType(@Args("id") id: string) {
		return this.seriesTypeService.delete(id);
	}
}
