import { Module } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { EnvironmentService } from "../configuration/environment.service";

import { RedisService } from "./redis.service";

@Module({
  providers: [
    {
      inject: [PinoLogger, EnvironmentService],
      provide: RedisService,
      useFactory: RedisService.create,
    },
  ],
  exports: [RedisService],
})
export class RedisServiceModule {}
