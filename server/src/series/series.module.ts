import { Module } from "@nestjs/common";

import { ReferenceServiceModule } from "src/reference/reference.service.module";
import { SeriesTypeServiceModule } from "src/series-type/series-type.service.module";

import { SeriesResolver } from "./series.resolver";
import { SeriesServiceModule } from "./series.service.module";

@Module({
	imports: [SeriesServiceModule, ReferenceServiceModule, SeriesTypeServiceModule],
	providers: [SeriesResolver],
})
export class SeriesModule {}
