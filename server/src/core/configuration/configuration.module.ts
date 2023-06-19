import { Module } from "@nestjs/common";

import { ConfigurationResolver } from "./configuration.resolver";
import { ConfigurationServiceModule } from "./configuration.service.module";

@Module({
  imports: [ConfigurationServiceModule],
  providers: [ConfigurationResolver],
})
export class ConfigurationModule {}
