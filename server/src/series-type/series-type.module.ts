import { Module } from "@nestjs/common";

import { SeriesTypeResolver } from "./series-type.resolver";
import { SeriesTypeServiceModule } from "./series-type.service.module";

@Module({
  imports: [SeriesTypeServiceModule],
  providers: [SeriesTypeResolver],
})
export class SeriesTypeModule {}
