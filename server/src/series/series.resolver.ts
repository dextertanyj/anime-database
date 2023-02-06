import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Series } from "@prisma/client";

import { convertNullToUndefined } from "src/common/utilities/type.utilities";
import { ReferenceService } from "src/reference/reference.service";
import { SeriesTypeService } from "src/series-type/series-type.service";

import { ValidatedCreateSeriesInput, ValidatedUpdateSeriesInput } from "./series.input";
import { SeriesService } from "./series.service";

@Resolver("Series")
export class SeriesResolver {
	constructor(
		private readonly seriesService: SeriesService,
		private readonly referenceService: ReferenceService,
		private readonly seriesTypeService: SeriesTypeService,
	) {}

	@Query()
	async series(@Args("id") id: string) {
		return this.seriesService.getById(id);
	}

	@Query()
	async serieses() {
		return this.seriesService.getAll();
	}

	@Mutation()
	async createSeries(@Args("input") input: ValidatedCreateSeriesInput) {
		const { release, type, ...data } = input;
		return this.seriesService.create({
			...data,
			seriesTypeId: type,
			releaseYear: release.year ?? undefined,
			releaseSeason: release.season ?? undefined,
		});
	}

	@Mutation()
	async updateSeries(@Args("id") id: string, @Args("input") input: ValidatedUpdateSeriesInput) {
		const { release, type, remarks, ...others } = input;
		const data = convertNullToUndefined(others);
		const referenceData =
			data.references !== undefined
				? convertNullToUndefined(data.references.map((item) => ({ ...item })))
				: undefined;
		return this.seriesService.update(id, {
			...data,
			references: referenceData,
			seriesTypeId: type ?? undefined,
			releaseYear: release?.year,
			releaseSeason: release?.season,
		});
	}

	@Mutation()
	async deleteSeries(@Args("id") id: string) {
		return this.seriesService.delete(id);
	}

	@ResolveField()
	async prequels(@Parent() series: Series) {
		return this.seriesService.getByRelation("prequels", series.id);
	}

	@ResolveField()
	async sequels(@Parent() series: Series) {
		return this.seriesService.getByRelation("sequels", series.id);
	}

	@ResolveField()
	async mainStories(@Parent() series: Series) {
		return this.seriesService.getByRelation("mainStories", series.id);
	}

	@ResolveField()
	async sideStories(@Parent() series: Series) {
		return this.seriesService.getByRelation("sideStories", series.id);
	}

	@ResolveField()
	async relatedSeries(@Parent() series: Series) {
		return this.seriesService.getByRelation("relatedSeries", series.id);
	}

	@ResolveField()
	async episodes(@Parent() series: Series) {
		throw "Not Implemented";
	}

	@ResolveField()
	async references(@Parent() series: Series) {
		return this.referenceService.getBySeries(series.id);
	}

	@ResolveField()
	async seasonNumber(@Parent() series: Series) {
		return this.seriesService.computeSeasonNumber(series.id);
	}

	@ResolveField()
	async status(@Parent() series: Series) {
		return this.seriesService.computeStatus(series.id);
	}

	@ResolveField()
	async type(@Parent() series: Series) {
		return this.seriesTypeService.getById(series.seriesTypeId);
	}
}
