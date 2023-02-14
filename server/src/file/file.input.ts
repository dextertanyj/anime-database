import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { CreateFileInput, UpdateFileInput } from "src/generated/graphql";

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

  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  resolutionHeight: number;

  @IsNumber()
  @IsNotEmpty()
  resolutionWidth: number;

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

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  resolutionHeight?: number | null;

  @IsOptional()
  @IsNumber()
  resolutionWidth?: number | null;

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
