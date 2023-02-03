import { Module } from "@nestjs/common";

import { WatchStatusService } from "./watch-status.service";

@Module({
	providers: [WatchStatusService],
	exports: [WatchStatusService],
})
export class WatchStatusServiceModule {}
