import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { IsStrongPassword } from "src/common/decorators/is-strong-password.decorator";
import { CreateUserInput, Role, UpdateUserInput } from "src/generated/graphql";

export class ValidatedCreateUserInput extends CreateUserInput {
	@IsEmail()
	email: string;

	@IsStrongPassword()
	password: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string | null;

	@IsEnum(Role)
	role: Role;
}

export class ValidatedUpdateUserInput extends UpdateUserInput {
	@IsOptional()
	@IsEmail()
	email?: string | null;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string | null;

	@IsOptional()
	@IsEnum(Role)
	role?: Role | null;
}
