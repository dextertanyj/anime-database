import { join } from "path";

import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { LoggerModule } from "nestjs-pino";
import passport from "passport";

import { AuthenticationModule } from "./authentication/authentication.module";
import { ExceptionFilter } from "./common/filters/exception.filter";
import { SessionMiddleware } from "./common/middlewares/session.middleware";
import { CustomValidationPipe } from "./common/pipes/validation.pipe";
import { ConfigurationModule } from "./core/configuration/configuration.module";
import { EnvironmentService } from "./core/configuration/environment.service";
import { CoreModule } from "./core/core.module";
import { EpisodeModule } from "./episode/episode.module";
import { FileModule } from "./file/file.module";
import { FileSourceModule } from "./file-source/file-source.module";
import { ReferenceModule } from "./reference/reference.module";
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
      inject: [EnvironmentService],
      driver: ApolloDriver,
      useFactory: (settings: EnvironmentService) => ({
        path: "/api/graphql",
        typePaths: [join(__dirname, "..", "..", "*.graphql")],
        debug: settings.get("environment") === "development",
        playground: false,
        plugins: [
          settings.get("environment") === "production"
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
    ConfigurationModule,
    SeriesTypeModule,
    FileSourceModule,
    WatchStatusModule,
    SeriesModule,
    EpisodeModule,
    FileModule,
    SetupModule,
    ReferenceModule,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    consumer.apply(SessionMiddleware, passport.initialize(), passport.session()).forRoutes("*");
  }
}
