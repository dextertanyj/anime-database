import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

import { CreateEpisodeInput, UpdateEpisodeInput } from "src/generated/graphql";

export class ValidatedCreateEpisodeInput extends CreateEpisodeInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  series: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  alternativeTitles: string[];

  @IsNumber()
  episodeNumber: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  remarks?: string | null;
}

export class ValidatedUpdateEpisodeInput extends UpdateEpisodeInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  series?: string | null;

  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  alternativeTitles?: string[] | null;

  @IsOptional()
  @IsNumber()
  episodeNumber?: number | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  remarks?: string | null;
}
