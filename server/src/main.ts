import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { ConfigService } from "./core/config/config.service";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const config = app.get(ConfigService);
  await app.listen(config.get("port"));
}
void bootstrap();
