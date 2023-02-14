import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { compare } from "bcrypt";

import { UnauthorizedError } from "src/common/errors/unauthorized.error";
import { UserService } from "src/user/user.service";

import { LoginAttemptService } from "./login-attempt/login-attempt.service";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly loginAttemptSerivce: LoginAttemptService,
    private readonly userService: UserService,
  ) {}

  async validateUser(data: {
    email: string;
    password: string;
    ipAddress: string;
  }): Promise<Omit<User, "password"> | null> {
    if (await this.loginAttemptSerivce.isLocked(data.email)) {
      throw new UnauthorizedError("Account is locked.");
    }

    const user = await this.userService.getByEmail(data.email);
    if (!user) {
      return null;
    }

    if (!(await compare(data.password, user.password))) {
      await this.loginAttemptSerivce.record({ ...data, isSuccessful: false });
      return null;
    }

    await this.loginAttemptSerivce.record({ ...data, isSuccessful: true });

    const { password, ...rest } = user;

    return rest;
  }
}
