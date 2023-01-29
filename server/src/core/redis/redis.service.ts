import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { createClient, RedisClientType } from "redis";

import { ConfigService } from "src/core/config/config.service";

@Injectable()
export class RedisService implements OnApplicationShutdown {
	private redisClient: RedisClientType;

	static async create(
		logger: PinoLogger,
		configService: ConfigService,
	): Promise<RedisService> {
		const redisService = new RedisService(
			logger,
			`redis://
			${configService.get("redis.host")}:
			${configService.get("redis.port")}`,
		);
		await redisService.connect();
		return redisService;
	}

	private constructor(private readonly logger: PinoLogger, url: string) {
		this.logger.setContext("RedisService");
		// Legacy mode required for connect-redis
		this.redisClient = createClient({ url, legacyMode: true });

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

	getClient(): RedisClientType {
		return this.redisClient;
	}

	async onApplicationShutdown() {
		await this.redisClient.v4.quit();
	}
}
