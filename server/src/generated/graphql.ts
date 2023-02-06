/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Season {
	WINTER = "WINTER",
	FALL = "FALL",
	SUMMER = "SUMMER",
	SPRING = "SPRING",
}

export enum Role {
	GUEST = "GUEST",
	MEMBER = "MEMBER",
	ADMIN = "ADMIN",
	OWNER = "OWNER",
}

export class SetupInput {
	email: string;
	password: string;
	name?: Nullable<string>;
}

export class SetConfigurationInput {
	key: string;
	value?: Nullable<string>;
}

export class CreateSeriesTypeInput {
	type: string;
}

export class UpdateSeriesTypeInput {
	type?: Nullable<string>;
}

export class CreateFileSourceInput {
	source: string;
}

export class UpdateFileSourceInput {
	source?: Nullable<string>;
}

export class CreateWatchStatusInput {
	status: string;
}

export class UpdateWatchStatusInput {
	status?: Nullable<string>;
}

export class CreateSessionInput {
	email: string;
	password: string;
}

export class CreateUserInput {
	email: string;
	password: string;
	name?: Nullable<string>;
	role: Role;
}

export class UpdateUserInput {
	email?: Nullable<string>;
	name?: Nullable<string>;
	role?: Nullable<Role>;
}

export class UpdatePasswordInput {
	oldPassword: string;
	newPassword: string;
}

export class CreateSeriesInput {
	title: string;
	alternativeTitles: string[];
	type: string;
	release: ReleaseDateInput;
	remarks?: Nullable<string>;
	prequels: string[];
	sequels: string[];
	mainStories: string[];
	sideStories: string[];
	relatedSeries: string[];
	references: ReferenceInput[];
}

export class UpdateSeriesInput {
	title?: Nullable<string>;
	alternativeTitles?: Nullable<string[]>;
	type?: Nullable<string>;
	release?: Nullable<ReleaseDateInput>;
	remarks?: Nullable<string>;
	prequels?: Nullable<string[]>;
	sequels?: Nullable<string[]>;
	mainStories?: Nullable<string[]>;
	sideStories?: Nullable<string[]>;
	relatedSeries?: Nullable<string[]>;
	references?: Nullable<ReferenceInput[]>;
}

export class ReleaseDateInput {
	year?: Nullable<number>;
	season?: Nullable<Season>;
}

export class ReferenceInput {
	id?: Nullable<string>;
	link: string;
	source: string;
}

export class CreateEpisodeInput {
	title: string;
	series: string;
	alternativeTitles: string[];
	episodeNumber: number;
	remarks?: Nullable<string>;
}

export class UpdateEpisodeInput {
	title?: Nullable<string>;
	series?: Nullable<string>;
	alternativeTitles?: Nullable<string[]>;
	episodeNumber?: Nullable<number>;
	remarks?: Nullable<string>;
}

export class CreateFileInput {
	episode: string;
	path: string;
	checksum: string;
	fileSize: Long;
	duration: number;
	resolutionHeight: number;
	resolutionWidth: number;
	codec: string;
	source: string;
	remarks?: Nullable<string>;
}

export class UpdateFileInput {
	episode?: Nullable<string>;
	path?: Nullable<string>;
	checksum?: Nullable<string>;
	fileSize?: Nullable<Long>;
	duration?: Nullable<number>;
	resolutionHeight?: Nullable<number>;
	resolutionWidth?: Nullable<number>;
	codec?: Nullable<string>;
	source?: Nullable<string>;
	remarks?: Nullable<string>;
}

export class CreateWatchProgressInput {
	series: string;
	status: string;
	completed: number;
	rating?: Nullable<RatingInput>;
	remarks?: Nullable<string>;
}

export class UpdateWatchProgressInput {
	series?: Nullable<string>;
	status?: Nullable<string>;
	completed?: Nullable<number>;
	rating?: Nullable<RatingInput>;
	remarks?: Nullable<string>;
}

export class RatingInput {
	overall?: Nullable<number>;
	execution?: Nullable<number>;
	story?: Nullable<number>;
	sound?: Nullable<number>;
	art?: Nullable<number>;
	character?: Nullable<number>;
	appeal?: Nullable<number>;
}

export interface SessionData {
	id: string;
	email: string;
	name?: Nullable<string>;
	role: Role;
}

export abstract class IQuery {
	abstract setup(): boolean | Promise<boolean>;

	abstract configuration(key: string): Nullable<string> | Promise<Nullable<string>>;

	abstract user(email?: Nullable<string>): Nullable<User> | Promise<Nullable<User>>;

	abstract users(): User[] | Promise<User[]>;

	abstract session(): Nullable<UserSession> | Promise<Nullable<UserSession>>;

	abstract series(id: string): Nullable<Series> | Promise<Nullable<Series>>;

	abstract serieses(): Series[] | Promise<Series[]>;

	abstract episode(id: string): Nullable<Episode> | Promise<Nullable<Episode>>;

	abstract episodes(): Episode[] | Promise<Episode[]>;

	abstract file(id: string): Nullable<File> | Promise<Nullable<File>>;

	abstract files(): File[] | Promise<File[]>;

	abstract progress(): WatchProgress[] | Promise<WatchProgress[]>;

	abstract fileSources(): FileSource[] | Promise<FileSource[]>;

	abstract seriesTypes(): SeriesType[] | Promise<SeriesType[]>;

	abstract watchStatuses(): WatchStatus[] | Promise<WatchStatus[]>;

	abstract suggestedCodecs(): string[] | Promise<string[]>;

	abstract suggestedSources(): string[] | Promise<string[]>;
}

export class UserSession implements SessionData {
	id: string;
	email: string;
	name?: Nullable<string>;
	role: Role;
}

export class User implements SessionData {
	id: string;
	email: string;
	name?: Nullable<string>;
	role: Role;
	progress: WatchProgress[];
}

export class Series {
	id: string;
	title: string;
	alternativeTitles: string[];
	type: SeriesType;
	seasonNumber: number;
	episodes: Episode[];
	status: string;
	releaseYear?: Nullable<number>;
	releaseSeason?: Nullable<Season>;
	remarks?: Nullable<string>;
	prequels: Series[];
	sequels: Series[];
	mainStories: Series[];
	sideStories: Series[];
	relatedSeries: Series[];
	references: Reference[];
	progress?: Nullable<WatchProgress>;
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class Reference {
	id: string;
	link: string;
	source: string;
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class SeriesType {
	id: string;
	type: string;
	series: Series[];
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class Episode {
	id: string;
	title: string;
	alternativeTitles: string[];
	series: Series;
	episodeNumber: number;
	files: File[];
	remarks?: Nullable<string>;
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class File {
	id: string;
	episode: Episode;
	path: string;
	checksum: string;
	fileSize: Long;
	duration: number;
	resolutionHeight: number;
	resolutionWidth: number;
	codec: string;
	source: FileSource;
	remarks?: Nullable<string>;
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class FileSource {
	id: string;
	source: string;
	files: File[];
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class WatchProgress {
	id: string;
	series: Series;
	user: User;
	status: WatchStatus;
	completed?: Nullable<number>;
	overall?: Nullable<number>;
	execution?: Nullable<number>;
	story?: Nullable<number>;
	sound?: Nullable<number>;
	art?: Nullable<number>;
	character?: Nullable<number>;
	appeal?: Nullable<number>;
	remarks?: Nullable<string>;
	createdAt: DateTime;
	updatedAt: DateTime;
}

export class WatchStatus {
	id: string;
	status: string;
	progresses: WatchProgress[];
	createdAt: DateTime;
	updatedAt: DateTime;
}

export abstract class IMutation {
	abstract setup(input: SetupInput): boolean | Promise<boolean>;

	abstract setConfiguration(input: SetConfigurationInput): string | Promise<string>;

	abstract createSeriesType(input: CreateSeriesTypeInput): SeriesType | Promise<SeriesType>;

	abstract updateSeriesType(
		id: string,
		input: UpdateSeriesTypeInput,
	): SeriesType | Promise<SeriesType>;

	abstract deleteSeriesType(id: string): SeriesType | Promise<SeriesType>;

	abstract createFileSource(input: CreateFileSourceInput): FileSource | Promise<FileSource>;

	abstract updateFileSource(
		id: string,
		input: UpdateFileSourceInput,
	): FileSource | Promise<FileSource>;

	abstract deleteFileSource(id: string): string | Promise<string>;

	abstract createWatchStatus(input: CreateWatchStatusInput): WatchStatus | Promise<WatchStatus>;

	abstract updateWatchStatus(
		id: string,
		input: UpdateWatchStatusInput,
	): WatchStatus | Promise<WatchStatus>;

	abstract deleteWatchStatus(id: string): string | Promise<string>;

	abstract createSession(input: CreateSessionInput): UserSession | Promise<UserSession>;

	abstract deleteSession(): boolean | Promise<boolean>;

	abstract createUser(input: CreateUserInput): User | Promise<User>;

	abstract updateUser(email: string, input: UpdateUserInput): User | Promise<User>;

	abstract deleteUser(email: string): string | Promise<string>;

	abstract updatePassword(email: string, input: UpdatePasswordInput): boolean | Promise<boolean>;

	abstract createSeries(input: CreateSeriesInput): Series | Promise<Series>;

	abstract updateSeries(id: string, input: UpdateSeriesInput): Series | Promise<Series>;

	abstract deleteSeries(id: string): string | Promise<string>;

	abstract createEpisode(input: CreateEpisodeInput): Episode | Promise<Episode>;

	abstract updateEpisode(id: string, input: UpdateEpisodeInput): Episode | Promise<Episode>;

	abstract deleteEpisode(id: string): string | Promise<string>;

	abstract createFile(input: CreateFileInput): File | Promise<File>;

	abstract updateFile(id: string, input: UpdateFileInput): File | Promise<File>;

	abstract deleteFile(id: string): string | Promise<string>;

	abstract createWatchProgress(
		input: CreateWatchProgressInput,
	): WatchProgress | Promise<WatchProgress>;

	abstract updateWatchProgress(
		id: string,
		input: UpdateWatchProgressInput,
	): WatchProgress | Promise<WatchProgress>;

	abstract deleteWatchProgress(id: string): string | Promise<string>;
}

export type DateTime = Date;
export type Long = number;
type Nullable<T> = T | null;
