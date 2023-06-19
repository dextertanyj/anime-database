import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { createClient, RedisClientType } from "redis";

import { EnvironmentService } from "src/core/configuration/environment.service";

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private redisClient: RedisClientType<Record<string, never>, Record<string, never>>;

  static async create(
    this: void,
    logger: PinoLogger,
    settings: EnvironmentService,
  ): Promise<RedisService> {
    const redisService = new RedisService(
      logger,
      `redis://
			${settings.get("redis.host")}:
			${settings.get("redis.port")}`,
    );
    await redisService.connect();
    return redisService;
  }

  private constructor(private readonly logger: PinoLogger, url: string) {
    this.logger.setContext("RedisService");
    this.redisClient = createClient({ url });

    this.redisClient.on("connect", () => {
      this.logger.info("Redis client connected successfully");
    });

    this.redisClient.on("error", (error: Error) => {
      this.logger.error(error.message);
    });
  }

  private async connect() {
    await this.redisClient.connect();
  }

  getClient(): RedisClientType<Record<string, never>, Record<string, never>> {
    return this.redisClient;
  }

  async onApplicationShutdown() {
    await this.redisClient.quit();
  }
}
