import { join } from "path";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import {
	ApolloServerPluginLandingPageLocalDefault,
	ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { LoggerModule } from "nestjs-pino";
import passport from "passport";

import { AuthenticationModule } from "./authentication/authentication.module";
import { ExceptionFilter } from "./common/filters/exception.filter";
import { SessionMiddleware } from "./common/middlewares/session.middleware";
import { CustomValidationPipe } from "./common/pipes/validation.pipe";
import { ConfigService } from "./core/config/config.service";
import { CoreModule } from "./core/core.module";
import { EpisodeModule } from "./episode/episode.module";
import { FileModule } from "./file/file.module";
import { FileSourceModule } from "./file-source/file-source.module";
import { SeriesModule } from "./series/series.module";
import { SeriesTypeModule } from "./series-type/series-type.module";
import { SetupModule } from "./setup/setup.module";
import { UserModule } from "./user/user.module";
import { WatchStatusModule } from "./watch-status/watch-status.module";

@Module({
	imports: [
		CoreModule, // Global modules
		LoggerModule.forRoot({
			pinoHttp: {
				customProps: () => ({ context: "NestApplication" }),
				autoLogging: false,
			},
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			inject: [ConfigService],
			driver: ApolloDriver,
			useFactory: (configService: ConfigService) => ({
				path: "/api/graphql",
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
		SeriesTypeModule,
		FileSourceModule,
		WatchStatusModule,
		SeriesModule,
		EpisodeModule,
		FileModule,
		SetupModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: ExceptionFilter,
		},
		{
			provide: APP_PIPE,
			useClass: CustomValidationPipe,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SessionMiddleware, passport.initialize(), passport.session()).forRoutes("*");
	}
}
