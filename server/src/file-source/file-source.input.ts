import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { CreateFileSourceInput, UpdateFileSourceInput } from "src/generated/graphql";

export class ValidatedCreateFileSourceInput extends CreateFileSourceInput {
  @IsString()
  @IsNotEmpty()
  source: string;
}

export class ValidatedUpdateFileSourceInput extends UpdateFileSourceInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  source?: string | null;
}
