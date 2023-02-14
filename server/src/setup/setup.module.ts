import { Module } from "@nestjs/common";

import { SetupResolver } from "./setup.resolver";
import { SetupServiceModule } from "./setup.service.module";

@Module({
  imports: [SetupServiceModule],
  providers: [SetupResolver],
})
export class SetupModule {}
