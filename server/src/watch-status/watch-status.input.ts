import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

import {
  CreateWatchStatusInput,
  UpdateWatchStatusInput,
  WatchStatusType,
} from "src/generated/graphql";

export class ValidatedCreateWatchStatusInput extends CreateWatchStatusInput {
  @IsString()
  @IsNotEmpty()
  status: string;

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
  @IsEnum(WatchStatusType)
  type?: WatchStatusType | null;
}
