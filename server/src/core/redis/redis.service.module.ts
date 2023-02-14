import { Module } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { ConfigService } from "src/core/config/config.service";

import { RedisService } from "./redis.service";

@Module({
  providers: [
    {
      inject: [PinoLogger, ConfigService],
      provide: RedisService,
      useFactory: RedisService.create,
    },
  ],
  exports: [RedisService],
})
export class RedisServiceModule {}
