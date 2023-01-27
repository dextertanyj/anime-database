import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { UserServiceModule } from "src/user/user.service.module";

import { AuthenticationResolver } from "./authentication.resolver";
import { AuthenticationServiceModule } from "./authentication.service.module";
import { LocalStrategy } from "./local.strategy";
import { SessionSerializer } from "./session.serialiser";

@Module({
	imports: [
		UserServiceModule,
		AuthenticationServiceModule,
		PassportModule.register({
			session: true,
		}),
	],
	providers: [LocalStrategy, SessionSerializer, AuthenticationResolver],
})
export class AuthenticationModule {}
