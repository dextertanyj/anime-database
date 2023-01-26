import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

import { ConfigService } from "src/core/config/config.service";

@Injectable()
export class RedisService implements OnApplicationShutdown {
	private redisClient: RedisClientType;

	static async create(configService: ConfigService): Promise<RedisService> {
		const redisService = new RedisService(
			`redis://
			${configService.get("redis.host")}:
			${configService.get("redis.port")}`,
		);
		await redisService.connect();
		return redisService;
	}

	private constructor(url: string) {
		// Legacy mode required for connect-redis
		this.redisClient = createClient({ url, legacyMode: true });
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
