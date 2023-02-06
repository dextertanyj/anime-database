import { ConflictException, HttpException } from "@nestjs/common";

import { BaseError } from "./base.error";

export class StateMismatchError extends BaseError {
	constructor(message?: string) {
		super(message);
		this.name = "StateMismatch";
	}

	getHttpException(): HttpException {
		return new ConflictException(this.message);
	}
}
