import { Module } from "@nestjs/common";

import { PrismaServiceModule } from "src/core/prisma/prisma.service.module";

import { LoginAttemptService } from "./login-attempt.service";

@Module({
	imports: [PrismaServiceModule],
	providers: [LoginAttemptService],
	exports: [LoginAttemptService],
})
export class LoginAttemptServiceModule {}
