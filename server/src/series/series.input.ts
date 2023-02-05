import { Type } from "class-transformer";
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	ValidateNested,
} from "class-validator";

import {
	CreateSeriesInput,
	ReferenceInput,
	ReleaseDateInput,
	Season,
	UpdateSeriesInput,
} from "src/generated/graphql";

export class ValidatedReferenceInput extends ReferenceInput {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	id?: string | null;

	@IsString()
	@IsNotEmpty()
	@IsUrl()
	link: string;

	@IsString()
	@IsNotEmpty()
	source: string;
}

export class ValidatedReleaseDateInput extends ReleaseDateInput {
	@IsOptional()
	@IsNumber()
	year?: number | null;

	@IsOptional()
	@IsEnum(Season)
	season?: Season | null;
}

export class ValidatedCreateSeriesInput extends CreateSeriesInput {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	alternativeTitles: string[];

	@IsString()
	@IsNotEmpty()
	type: string;

	@ValidateNested()
	@Type(() => ValidatedReleaseDateInput)
	release: ValidatedReleaseDateInput;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	remarks?: string | null;

	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	prequels: string[];

	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	sequels: string[];

	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	mainStories: string[];

	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	sideStories: string[];

	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	relatedSeries: string[];

	@ValidateNested({ each: true })
	@Type(() => ValidatedReferenceInput)
	references: ValidatedReferenceInput[];
}

export class ValidatedUpdateSeriesInput extends UpdateSeriesInput {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	alternativeTitles?: string[] | null;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	type?: string | null;

	@IsOptional()
	@ValidateNested()
	@Type(() => ValidatedReleaseDateInput)
	release?: ValidatedReleaseDateInput | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	remarks?: string | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	prequels?: string[] | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	sequels?: string[] | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	mainStories?: string[] | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	sideStories?: string[] | null;

	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	relatedSeries?: string[] | null;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ValidatedReferenceInput)
	references?: ValidatedReferenceInput[] | null;
}
