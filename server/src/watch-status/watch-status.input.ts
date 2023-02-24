import { IsEnum, IsHexColor, IsNotEmpty, IsOptional, IsString } from "class-validator";

import {
  CreateWatchStatusInput,
  SetDefaultWatchStatusInput,
  UpdateWatchStatusInput,
  WatchStatusType,
} from "src/generated/graphql";

export class ValidatedCreateWatchStatusInput extends CreateWatchStatusInput {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;

  @IsOptional()
  @IsEnum(WatchStatusType)
  type?: WatchStatusType | null;
}

export class ValidatedUpdateWatchStatusInput extends UpdateWatchStatusInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;

  @IsOptional()
  @IsEnum(WatchStatusType)
  type?: WatchStatusType | null;
}

export class ValidatedSetDefaultWatchStatusInput extends SetDefaultWatchStatusInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(WatchStatusType)
  type: WatchStatusType;
}
