import { Module } from "@nestjs/common";

import { PrismaServiceModule } from "src/core/prisma/prisma.service.module";

import { UserService } from "./user.service";

@Module({
	imports: [PrismaServiceModule],
	providers: [UserService],
	exports: [UserService],
})
export class UserServiceModule {}
