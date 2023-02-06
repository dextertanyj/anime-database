import { Injectable } from "@nestjs/common";
import { Role, User } from "@prisma/client";

import { StateMismatchError } from "src/common/errors/state-mismatch.error";
import { UserService } from "src/user/user.service";

@Injectable()
export class SetupService {
	constructor(private readonly userService: UserService) {}

	async isSetup(): Promise<boolean> {
		const users = await this.userService.getAll();
		return users.filter((user) => user.role === Role.OWNER).length !== 0;
	}

	async setup(data: { email: string; name: string; password: string }): Promise<User> {
		if (await this.isSetup()) {
			throw new StateMismatchError("System already set up.");
		}
		return this.userService.create({
			...data,
			role: Role.OWNER,
		});
	}
}
