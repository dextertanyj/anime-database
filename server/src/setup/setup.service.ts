import { Injectable } from "@nestjs/common";
import { Role, User } from "@prisma/client";

import { defaults } from "src/common/defaults/defaults";
import { StateMismatchError } from "src/common/errors/state-mismatch.error";
import { WatchStatusType } from "src/generated/graphql";
import { UserService } from "src/user/user.service";
import { WatchStatusService } from "src/watch-status/watch-status.service";

@Injectable()
export class SetupService {
  constructor(
    private readonly userService: UserService,
    private readonly watchStatusService: WatchStatusService,
  ) {}

  async isSetup(): Promise<boolean> {
    const users = await this.userService.getAll();
    return users.filter((user) => user.role === Role.OWNER).length !== 0;
  }

  async setup(data: { email: string; name: string; password: string }): Promise<User> {
    if (await this.isSetup()) {
      throw new StateMismatchError("System already set up.");
    }
    const user = this.userService.create({
      ...data,
      role: Role.OWNER,
    });
    await this.watchStatusService.create({
      ...defaults.WatchStatus.IN_PROGRESS,
      type: WatchStatusType.IN_PROGRESS,
    });
    await this.watchStatusService.create({
      ...defaults.WatchStatus.COMPLETED,
      type: WatchStatusType.COMPLETED,
    });
    return user;
  }
}
