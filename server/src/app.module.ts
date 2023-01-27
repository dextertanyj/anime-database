import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import passport from "passport";
import { join } from "path";

import { AuthenticationModule } from "./authentication/authentication.module";
import { SessionMiddleware } from "./common/middlewares/session.middleware";
import { ConfigService } from "./core/config/config.service";
import { CoreModule } from "./core/core.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		CoreModule, // Global modules
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
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
		AuthenticationModule,
		UserModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(SessionMiddleware, passport.initialize(), passport.session())
			.forRoutes("*");
	}
}
