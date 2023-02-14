import { Module } from "@nestjs/common";

import { WatchStatusResolver } from "./watch-status.resolver";
import { WatchStatusServiceModule } from "./watch-status.service.module";

@Module({
  imports: [WatchStatusServiceModule],
  providers: [WatchStatusResolver],
})
export class WatchStatusModule {}
