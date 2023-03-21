import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

import {
  CreateFileInput,
  CreateResolutionInput,
  UpdateFileInput,
  UpdateResolutionInput,
} from "src/generated/graphql";

export class ValidatedCreateResolutionInput extends CreateResolutionInput {
  @IsInt()
  height: number;

  @IsInt()
  width: number;
}

export class ValidatedUpdateResolutionInput extends UpdateResolutionInput {
  @IsOptional()
  @IsInt()
  height?: number | null;

  @IsOptional()
  @IsInt()
  width?: number | null;
}

export class ValidatedCreateFileInput extends CreateFileInput {
  @IsString()
  @IsNotEmpty()
  episode: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  checksum: string;

  @IsInt()
  fileSize: number;

  @IsInt()
  duration: number;

  @ValidateNested()
  @Type(() => ValidatedCreateResolutionInput)
  resolution: ValidatedCreateResolutionInput;

  @IsString()
  @IsNotEmpty()
  codec: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  remarks?: string | null;
}

export class ValidatedUpdateFileInput extends UpdateFileInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  episode?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  path?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  checksum?: string | null;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  fileSize?: number | null;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  duration?: number | null;

  @ValidateNested()
  @Type(() => ValidatedUpdateResolutionInput)
  resolution?: ValidatedUpdateResolutionInput | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  codec?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  source?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  remarks?: string | null;
}
