import { Module } from "@nestjs/common";

import { UserServiceModule } from "src/user/user.service.module";

import { LoginAttemptServiceModule } from "./login-attempt/login-attempt.service.module";
import { AuthenticationService } from "./authentication.service";

@Module({
  imports: [UserServiceModule, LoginAttemptServiceModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationServiceModule {}
