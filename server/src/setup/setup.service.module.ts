import { Module } from "@nestjs/common";

import { UserServiceModule } from "src/user/user.service.module";
import { WatchStatusServiceModule } from "src/watch-status/watch-status.service.module";

import { SetupService } from "./setup.service";

@Module({
  imports: [UserServiceModule, WatchStatusServiceModule],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupServiceModule {}
