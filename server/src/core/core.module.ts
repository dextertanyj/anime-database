import { Global, Module } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { LoggingPlugin } from "src/common/plugins/logging.plugin";
import { LongScalar } from "src/common/scalars/long.scalar";

import { ConfigurationServiceModule } from "./configuration/configuration.service.module";
import { PrismaServiceModule } from "./prisma/prisma.service.module";
import { RedisServiceModule } from "./redis/redis.service.module";

@Global()
@Module({
  imports: [ConfigurationServiceModule, RedisServiceModule, PrismaServiceModule],
  providers: [PinoLogger, LoggingPlugin, LongScalar],
  exports: [ConfigurationServiceModule, RedisServiceModule, PrismaServiceModule],
})
export class CoreModule {}
