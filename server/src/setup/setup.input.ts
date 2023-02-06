import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { IsStrongPassword } from "src/common/decorators/is-strong-password.decorator";
import { SetupInput } from "src/generated/graphql";

export class ValidatedSetupInput extends SetupInput {
	@IsEmail()
	email: string;

	@IsStrongPassword()
	password: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name: string;
}
