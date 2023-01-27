import { Module } from "@nestjs/common";

import { ConfigService } from "src/core/config/config.service";

import { RedisService } from "./redis.service";

@Module({
	providers: [
		{
			inject: [ConfigService],
			provide: RedisService,
			useFactory: RedisService.create,
		},
	],
	exports: [RedisService],
})
export class RedisServiceModule {}
