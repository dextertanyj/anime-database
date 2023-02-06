import { Module } from "@nestjs/common";

import { EpisodeServiceModule } from "src/episode/episode.service.module";
import { ReferenceServiceModule } from "src/reference/reference.service.module";
import { SeriesTypeServiceModule } from "src/series-type/series-type.service.module";

import { SeriesResolver } from "./series.resolver";
import { SeriesServiceModule } from "./series.service.module";

@Module({
	imports: [
		SeriesServiceModule,
		EpisodeServiceModule,
		ReferenceServiceModule,
		SeriesTypeServiceModule,
	],
	providers: [SeriesResolver],
})
export class SeriesModule {}
