import { Module } from "@nestjs/common";

import { EpisodeService } from "./episode.service";

@Module({
	providers: [EpisodeService],
	exports: [EpisodeService],
})
export class EpisodeServiceModule {}
