import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { EnvironmentService } from "../configuration/environment.service";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly settings: EnvironmentService) {
    super({
      datasources: {
        db: {
          url: `postgresql://
						${settings.get("database.username")}:
						${settings.get("database.password")}@
						${settings.get("database.host")}:
						${settings.get("database.port")}/
						${settings.get("database.database")}?
						schema=public`,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", () => {
      void app.close();
    });
  }
}
