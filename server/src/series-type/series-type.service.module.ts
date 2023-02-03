import { Module } from "@nestjs/common";

import { SeriesTypeService } from "./series-type.service";

@Module({
	providers: [SeriesTypeService],
	exports: [SeriesTypeService],
})
export class SeriesTypeServiceModule {}
