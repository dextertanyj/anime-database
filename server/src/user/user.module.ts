import { Module } from "@nestjs/common";

import { UserResolver } from "./user.resolver";
import { UserServiceModule } from "./user.service.module";

@Module({
  imports: [UserServiceModule],
  providers: [UserResolver],
})
export class UserModule {}
