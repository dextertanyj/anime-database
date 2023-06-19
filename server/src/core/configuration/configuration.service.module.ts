import { Module } from "@nestjs/common";

import { ConfigurationService } from "./configuration.service";
import { EnvironmentService } from "./environment.service";

@Module({
  providers: [EnvironmentService, ConfigurationService],
  exports: [EnvironmentService, ConfigurationService],
})
export class ConfigurationServiceModule {}
