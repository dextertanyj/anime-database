import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { join } from "path";

import { ConfigService } from "./core/config/config.service";
import { ConfigServiceModule } from "./core/config/config.service.module";

@Module({
	imports: [
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			imports: [ConfigServiceModule],
			inject: [ConfigService],
			driver: ApolloDriver,
			useFactory: (configService: ConfigService) => ({
				typePaths: [join(__dirname, "..", "..", "*.graphql")],
				debug: configService.get("environment") === "development",
				playground: false,
				plugins: [
					configService.get("environment") === "production"
						? ApolloServerPluginLandingPageProductionDefault({
								footer: false,
						  })
						: ApolloServerPluginLandingPageLocalDefault({
								footer: false,
						  }),
				],
			}),
		}),
	],
})
export class AppModule {}
