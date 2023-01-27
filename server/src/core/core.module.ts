import { Global, Module } from "@nestjs/common";

import { ConfigServiceModule } from "./config/config.service.module";
import { PrismaServiceModule } from "./prisma/prisma.service.module";
import { RedisServiceModule } from "./redis/redis.service.module";

@Global()
@Module({
	imports: [ConfigServiceModule, RedisServiceModule, PrismaServiceModule],
	exports: [ConfigServiceModule, RedisServiceModule, PrismaServiceModule],
})
export class CoreModule {}
