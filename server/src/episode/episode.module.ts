import { Module } from "@nestjs/common";

import { EpisodeResolver } from "./episode.resolver";
import { EpisodeServiceModule } from "./episode.service.module";

@Module({
	imports: [EpisodeServiceModule],
	providers: [EpisodeResolver],
})
export class EpisodeModule {}
