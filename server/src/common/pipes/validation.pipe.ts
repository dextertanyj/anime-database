import {
	Injectable,
	UnprocessableEntityException,
	ValidationPipe,
} from "@nestjs/common";
import { ValidationError } from "class-validator";

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
	constructor() {
		super({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors: ValidationError[]) => {
				const error = this.flattenValidationErrors(errors);
				throw new UnprocessableEntityException(error.join("\n"));
			},
		});
	}
}
