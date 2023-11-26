import { Module } from "@nestjs/common";

import { SeriesServiceModule } from "src/series/series.service.module";
import { SeriesTypeServiceModule } from "src/series-type/series-type.service.module";

import { AniDBService } from "./anidb/anidb.service";
import { IntegrationResolver } from "./integration.resolver";

@Module({
  imports: [SeriesServiceModule, SeriesTypeServiceModule],
  providers: [IntegrationResolver, AniDBService],
})
export class IntegrationModule {}
