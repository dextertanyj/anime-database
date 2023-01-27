import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

import { UserService } from "src/user/user.service";

type SerializedUser = { id: string };

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly userService: UserService) {
		super();
	}

	serializeUser(
		user: Express.User,
		done: (err: Error | null, payload: SerializedUser) => void,
	) {
		done(null, { id: user.id });
	}

	async deserializeUser(
		payload: SerializedUser,
		done: (err: Error | null, user: Express.User | null) => void,
	) {
		const user = await this.userService.getById(payload.id);
		done(null, user);
	}
}
