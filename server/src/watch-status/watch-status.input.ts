import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import {
	CreateWatchStatusInput,
	UpdateWatchStatusInput,
} from "src/generated/graphql";

export class ValidatedCreateWatchStatusInput extends CreateWatchStatusInput {
	@IsString()
	@IsNotEmpty()
	status: string;
}

export class ValidatedUpdateWatchStatusInput extends UpdateWatchStatusInput {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	status?: string | null;
}
