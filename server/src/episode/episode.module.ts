import { Module } from "@nestjs/common";

import { FileServiceModule } from "src/file/file.service.module";
import { SeriesServiceModule } from "src/series/series.service.module";

import { EpisodeResolver } from "./episode.resolver";
import { EpisodeServiceModule } from "./episode.service.module";

@Module({
	imports: [EpisodeServiceModule, SeriesServiceModule, FileServiceModule],
	providers: [EpisodeResolver],
})
export class EpisodeModule {}
