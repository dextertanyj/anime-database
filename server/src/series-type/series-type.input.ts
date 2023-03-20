import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { CreateSeriesTypeInput, UpdateSeriesTypeInput } from "src/generated/graphql";

export class ValidatedCreateSeriesTypeInput extends CreateSeriesTypeInput {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsBoolean()
  singular: boolean;
}

export class ValidatedUpdateSeriesTypeInput extends UpdateSeriesTypeInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string | null;

  @IsOptional()
  @IsBoolean()
  singular?: boolean | null;
}
