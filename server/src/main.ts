import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { EnvironmentService } from "./core/configuration/environment.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const settings = app.get(EnvironmentService);
  await app.listen(settings.get("port"));
}
void bootstrap();
