import { Global, Module } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { LoggingPlugin } from "src/common/plugins/logging.plugin";

import { ConfigServiceModule } from "./config/config.service.module";
import { PrismaServiceModule } from "./prisma/prisma.service.module";
import { RedisServiceModule } from "./redis/redis.service.module";

@Global()
@Module({
	imports: [ConfigServiceModule, RedisServiceModule, PrismaServiceModule],
	providers: [PinoLogger, LoggingPlugin],
	exports: [ConfigServiceModule, RedisServiceModule, PrismaServiceModule],
})
export class CoreModule {}
