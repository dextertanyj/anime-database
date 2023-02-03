import { HttpException, InternalServerErrorException } from "@nestjs/common";

export class BaseError {
	protected name: string;
	protected message: string | undefined;

	constructor(message?: string) {
		this.name = "Base";
		this.message = message;
	}

	getHttpException(): HttpException {
		return new InternalServerErrorException(this.message ?? this.name);
	}
}
