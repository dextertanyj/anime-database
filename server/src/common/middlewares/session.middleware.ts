import { Injectable, NestMiddleware } from "@nestjs/common";
import RedisStore from "connect-redis";
import { NextFunction, Request, RequestHandler, Response } from "express";
import session from "express-session";

import { EnvironmentService } from "src/core/configuration/environment.service";
import { RedisService } from "src/core/redis/redis.service";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly middleware: RequestHandler;

  constructor(private readonly settings: EnvironmentService, private readonly redis: RedisService) {
    const store = new RedisStore({
      client: this.redis.getClient(),
      prefix: "SESSION:",
    });

    this.middleware = session({
      name: this.settings.get("session.name"),
      secret: this.settings.get("session.secret"),
      cookie: {
        httpOnly: true,
        sameSite: "strict",
        maxAge: this.settings.get("session.maxAge"),
        secure: this.settings.get("environment") !== "development",
      },
      resave: false,
      saveUninitialized: false,
      store: store,
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.middleware(req, res, next);
  }
}
