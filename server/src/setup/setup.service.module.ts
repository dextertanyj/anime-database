import { Module } from "@nestjs/common";

import { UserServiceModule } from "src/user/user.service.module";

import { SetupService } from "./setup.service";

@Module({
	imports: [UserServiceModule],
	providers: [SetupService],
	exports: [SetupService],
})
export class SetupServiceModule {}
