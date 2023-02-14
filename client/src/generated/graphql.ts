/* eslint-disable */
/* tslint:disable */
import type { ClientError } from "graphql-request";
import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables extends { [key: string]: any }>(
	client: GraphQLClient,
	query: string,
	variables?: TVariables,
	requestHeaders?: RequestInit["headers"],
) {
	return async (): Promise<TData> =>
		client.request({
			document: query,
			variables,
			requestHeaders,
		});
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	DateTime: Date;
	Long: number;
};

export type CreateEpisodeInput = {
	alternativeTitles: Array<Scalars["String"]>;
	episodeNumber: Scalars["Int"];
	remarks?: InputMaybe<Scalars["String"]>;
	series: Scalars["ID"];
	title: Scalars["String"];
};

export type CreateFileInput = {
	checksum: Scalars["String"];
	codec: Scalars["String"];
	duration: Scalars["Int"];
	episode: Scalars["ID"];
	fileSize: Scalars["Long"];
	path: Scalars["String"];
	remarks?: InputMaybe<Scalars["String"]>;
	resolutionHeight: Scalars["Int"];
	resolutionWidth: Scalars["Int"];
	source: Scalars["ID"];
};

export type CreateFileSourceInput = {
	source: Scalars["String"];
};

export type CreateSeriesInput = {
	alternativeTitles: Array<Scalars["String"]>;
	mainStories: Array<Scalars["ID"]>;
	prequels: Array<Scalars["ID"]>;
	references: Array<ReferenceInput>;
	relatedSeries: Array<Scalars["ID"]>;
	release: ReleaseDateInput;
	remarks?: InputMaybe<Scalars["String"]>;
	sequels: Array<Scalars["ID"]>;
	sideStories: Array<Scalars["ID"]>;
	title: Scalars["String"];
	type: Scalars["ID"];
};

export type CreateSeriesTypeInput = {
	type: Scalars["String"];
};

export type CreateSessionInput = {
	email: Scalars["String"];
	password: Scalars["String"];
};

export type CreateUserInput = {
	email: Scalars["String"];
	name?: InputMaybe<Scalars["String"]>;
	password: Scalars["String"];
	role: Role;
};

export type CreateWatchProgressInput = {
	completed: Scalars["Int"];
	rating?: InputMaybe<RatingInput>;
	remarks?: InputMaybe<Scalars["String"]>;
	series: Scalars["ID"];
	status: Scalars["ID"];
};

export type CreateWatchStatusInput = {
	status: Scalars["String"];
};

export type Episode = {
	__typename?: "Episode";
	alternativeTitles: Array<Scalars["String"]>;
	createdAt: Scalars["DateTime"];
	episodeNumber: Scalars["Int"];
	files: Array<File>;
	id: Scalars["ID"];
	remarks?: Maybe<Scalars["String"]>;
	series: Series;
	title: Scalars["String"];
	updatedAt: Scalars["DateTime"];
};

export type File = {
	__typename?: "File";
	checksum: Scalars["String"];
	codec: Scalars["String"];
	createdAt: Scalars["DateTime"];
	duration: Scalars["Int"];
	episode: Episode;
	fileSize: Scalars["Long"];
	id: Scalars["ID"];
	path: Scalars["String"];
	remarks?: Maybe<Scalars["String"]>;
	resolutionHeight: Scalars["Int"];
	resolutionWidth: Scalars["Int"];
	source: FileSource;
	updatedAt: Scalars["DateTime"];
};

export type FileSource = {
	__typename?: "FileSource";
	createdAt: Scalars["DateTime"];
	files: Array<File>;
	id: Scalars["ID"];
	source: Scalars["String"];
	updatedAt: Scalars["DateTime"];
};

export type Mutation = {
	__typename?: "Mutation";
	createEpisode: Episode;
	createFile: File;
	createFileSource: FileSource;
	createSeries: Series;
	createSeriesType: SeriesType;
	createSession: UserSession;
	createUser: User;
	createWatchProgress: WatchProgress;
	createWatchStatus: WatchStatus;
	deleteEpisode: Scalars["ID"];
	deleteFile: Scalars["ID"];
	deleteFileSource: Scalars["ID"];
	deleteSeries: Scalars["ID"];
	deleteSeriesType: SeriesType;
	deleteSession: Scalars["Boolean"];
	deleteUser: Scalars["ID"];
	deleteWatchProgress: Scalars["ID"];
	deleteWatchStatus: Scalars["ID"];
	setConfiguration: Scalars["String"];
	setup: Scalars["Boolean"];
	updateEpisode: Episode;
	updateFile: File;
	updateFileSource: FileSource;
	updatePassword: Scalars["Boolean"];
	updateSeries: Series;
	updateSeriesType: SeriesType;
	updateUser: User;
	updateWatchProgress: WatchProgress;
	updateWatchStatus: WatchStatus;
};

export type MutationCreateEpisodeArgs = {
	input: CreateEpisodeInput;
};

export type MutationCreateFileArgs = {
	input: CreateFileInput;
};

export type MutationCreateFileSourceArgs = {
	input: CreateFileSourceInput;
};

export type MutationCreateSeriesArgs = {
	input: CreateSeriesInput;
};

export type MutationCreateSeriesTypeArgs = {
	input: CreateSeriesTypeInput;
};

export type MutationCreateSessionArgs = {
	input: CreateSessionInput;
};

export type MutationCreateUserArgs = {
	input: CreateUserInput;
};

export type MutationCreateWatchProgressArgs = {
	input: CreateWatchProgressInput;
};

export type MutationCreateWatchStatusArgs = {
	input: CreateWatchStatusInput;
};

export type MutationDeleteEpisodeArgs = {
	id: Scalars["ID"];
};

export type MutationDeleteFileArgs = {
	id: Scalars["ID"];
};

export type MutationDeleteFileSourceArgs = {
	id: Scalars["ID"];
};

export type MutationDeleteSeriesArgs = {
	id: Scalars["ID"];
};

export type MutationDeleteSeriesTypeArgs = {
	id: Scalars["ID"];
};

export type MutationDeleteUserArgs = {
	email: Scalars["String"];
};

export type MutationDeleteWatchProgressArgs = {
	id: Scalars["ID"];
};

export type MutationDeleteWatchStatusArgs = {
	id: Scalars["ID"];
};

export type MutationSetConfigurationArgs = {
	input: SetConfigurationInput;
};

export type MutationSetupArgs = {
	input: SetupInput;
};

export type MutationUpdateEpisodeArgs = {
	id: Scalars["ID"];
	input: UpdateEpisodeInput;
};

export type MutationUpdateFileArgs = {
	id: Scalars["ID"];
	input: UpdateFileInput;
};

export type MutationUpdateFileSourceArgs = {
	id: Scalars["ID"];
	input: UpdateFileSourceInput;
};

export type MutationUpdatePasswordArgs = {
	email: Scalars["String"];
	input: UpdatePasswordInput;
};

export type MutationUpdateSeriesArgs = {
	id: Scalars["ID"];
	input: UpdateSeriesInput;
};

export type MutationUpdateSeriesTypeArgs = {
	id: Scalars["ID"];
	input: UpdateSeriesTypeInput;
};

export type MutationUpdateUserArgs = {
	email: Scalars["String"];
	input: UpdateUserInput;
};

export type MutationUpdateWatchProgressArgs = {
	id: Scalars["ID"];
	input: UpdateWatchProgressInput;
};

export type MutationUpdateWatchStatusArgs = {
	id: Scalars["ID"];
	input: UpdateWatchStatusInput;
};

export type Query = {
	__typename?: "Query";
	configuration?: Maybe<Scalars["String"]>;
	episode?: Maybe<Episode>;
	episodes: Array<Episode>;
	file?: Maybe<File>;
	fileSources: Array<FileSource>;
	files: Array<File>;
	progress: Array<WatchProgress>;
	series?: Maybe<Series>;
	seriesTypes: Array<SeriesType>;
	serieses: Array<Series>;
	session?: Maybe<UserSession>;
	setup: Scalars["Boolean"];
	suggestedCodecs: Array<Scalars["String"]>;
	suggestedSources: Array<Scalars["String"]>;
	user?: Maybe<User>;
	users: Array<User>;
	watchStatuses: Array<WatchStatus>;
};

export type QueryConfigurationArgs = {
	key: Scalars["String"];
};

export type QueryEpisodeArgs = {
	id: Scalars["ID"];
};

export type QueryFileArgs = {
	id: Scalars["ID"];
};

export type QuerySeriesArgs = {
	id: Scalars["ID"];
};

export type QueryUserArgs = {
	email?: InputMaybe<Scalars["String"]>;
};

export type RatingInput = {
	appeal?: InputMaybe<Scalars["Int"]>;
	art?: InputMaybe<Scalars["Int"]>;
	character?: InputMaybe<Scalars["Int"]>;
	execution?: InputMaybe<Scalars["Int"]>;
	overall?: InputMaybe<Scalars["Int"]>;
	sound?: InputMaybe<Scalars["Int"]>;
	story?: InputMaybe<Scalars["Int"]>;
};

export type Reference = {
	__typename?: "Reference";
	createdAt: Scalars["DateTime"];
	id: Scalars["ID"];
	link: Scalars["String"];
	source: Scalars["String"];
	updatedAt: Scalars["DateTime"];
};

export type ReferenceInput = {
	id?: InputMaybe<Scalars["ID"]>;
	link: Scalars["String"];
	source: Scalars["String"];
};

export type ReleaseDateInput = {
	season?: InputMaybe<Season>;
	year?: InputMaybe<Scalars["Int"]>;
};

export enum Role {
	Admin = "ADMIN",
	Guest = "GUEST",
	Member = "MEMBER",
	Owner = "OWNER",
}

export enum Season {
	Fall = "FALL",
	Spring = "SPRING",
	Summer = "SUMMER",
	Winter = "WINTER",
}

export type Series = {
	__typename?: "Series";
	alternativeTitles: Array<Scalars["String"]>;
	createdAt: Scalars["DateTime"];
	episodes: Array<Episode>;
	id: Scalars["ID"];
	mainStories: Array<Series>;
	prequels: Array<Series>;
	progress?: Maybe<WatchProgress>;
	references: Array<Reference>;
	relatedSeries: Array<Series>;
	releaseSeason?: Maybe<Season>;
	releaseYear?: Maybe<Scalars["Int"]>;
	remarks?: Maybe<Scalars["String"]>;
	seasonNumber: Scalars["Int"];
	sequels: Array<Series>;
	sideStories: Array<Series>;
	status: Scalars["String"];
	title: Scalars["String"];
	type: SeriesType;
	updatedAt: Scalars["DateTime"];
};

export type SeriesType = {
	__typename?: "SeriesType";
	createdAt: Scalars["DateTime"];
	id: Scalars["ID"];
	series: Array<Series>;
	type: Scalars["String"];
	updatedAt: Scalars["DateTime"];
};

export type SessionData = {
	email: Scalars["String"];
	id: Scalars["ID"];
	name?: Maybe<Scalars["String"]>;
	role: Role;
};

export type SetConfigurationInput = {
	key: Scalars["String"];
	value?: InputMaybe<Scalars["String"]>;
};

export type SetupInput = {
	email: Scalars["String"];
	name?: InputMaybe<Scalars["String"]>;
	password: Scalars["String"];
};

export type UpdateEpisodeInput = {
	alternativeTitles?: InputMaybe<Array<Scalars["String"]>>;
	episodeNumber?: InputMaybe<Scalars["Int"]>;
	remarks?: InputMaybe<Scalars["String"]>;
	series?: InputMaybe<Scalars["ID"]>;
	title?: InputMaybe<Scalars["String"]>;
};

export type UpdateFileInput = {
	checksum?: InputMaybe<Scalars["String"]>;
	codec?: InputMaybe<Scalars["String"]>;
	duration?: InputMaybe<Scalars["Int"]>;
	episode?: InputMaybe<Scalars["ID"]>;
	fileSize?: InputMaybe<Scalars["Long"]>;
	path?: InputMaybe<Scalars["String"]>;
	remarks?: InputMaybe<Scalars["String"]>;
	resolutionHeight?: InputMaybe<Scalars["Int"]>;
	resolutionWidth?: InputMaybe<Scalars["Int"]>;
	source?: InputMaybe<Scalars["ID"]>;
};

export type UpdateFileSourceInput = {
	source?: InputMaybe<Scalars["String"]>;
};

export type UpdatePasswordInput = {
	newPassword: Scalars["String"];
	oldPassword: Scalars["String"];
};

export type UpdateSeriesInput = {
	alternativeTitles?: InputMaybe<Array<Scalars["String"]>>;
	mainStories?: InputMaybe<Array<Scalars["ID"]>>;
	prequels?: InputMaybe<Array<Scalars["ID"]>>;
	references?: InputMaybe<Array<ReferenceInput>>;
	relatedSeries?: InputMaybe<Array<Scalars["ID"]>>;
	release?: InputMaybe<ReleaseDateInput>;
	remarks?: InputMaybe<Scalars["String"]>;
	sequels?: InputMaybe<Array<Scalars["ID"]>>;
	sideStories?: InputMaybe<Array<Scalars["ID"]>>;
	title?: InputMaybe<Scalars["String"]>;
	type?: InputMaybe<Scalars["ID"]>;
};

export type UpdateSeriesTypeInput = {
	type?: InputMaybe<Scalars["String"]>;
};

export type UpdateUserInput = {
	email?: InputMaybe<Scalars["String"]>;
	name?: InputMaybe<Scalars["String"]>;
	role?: InputMaybe<Role>;
};

export type UpdateWatchProgressInput = {
	completed?: InputMaybe<Scalars["Int"]>;
	rating?: InputMaybe<RatingInput>;
	remarks?: InputMaybe<Scalars["String"]>;
	series?: InputMaybe<Scalars["ID"]>;
	status?: InputMaybe<Scalars["ID"]>;
};

export type UpdateWatchStatusInput = {
	status?: InputMaybe<Scalars["String"]>;
};

export type User = SessionData & {
	__typename?: "User";
	email: Scalars["String"];
	id: Scalars["ID"];
	name?: Maybe<Scalars["String"]>;
	progress: Array<WatchProgress>;
	role: Role;
};

export type UserSession = SessionData & {
	__typename?: "UserSession";
	email: Scalars["String"];
	id: Scalars["ID"];
	name?: Maybe<Scalars["String"]>;
	role: Role;
};

export type WatchProgress = {
	__typename?: "WatchProgress";
	appeal?: Maybe<Scalars["Int"]>;
	art?: Maybe<Scalars["Int"]>;
	character?: Maybe<Scalars["Int"]>;
	completed?: Maybe<Scalars["Int"]>;
	createdAt: Scalars["DateTime"];
	execution?: Maybe<Scalars["Int"]>;
	id: Scalars["ID"];
	overall?: Maybe<Scalars["Int"]>;
	remarks?: Maybe<Scalars["String"]>;
	series: Series;
	sound?: Maybe<Scalars["Int"]>;
	status: WatchStatus;
	story?: Maybe<Scalars["Int"]>;
	updatedAt: Scalars["DateTime"];
	user: User;
};

export type WatchStatus = {
	__typename?: "WatchStatus";
	createdAt: Scalars["DateTime"];
	id: Scalars["ID"];
	progresses: Array<WatchProgress>;
	status: Scalars["String"];
	updatedAt: Scalars["DateTime"];
};

export type SessionDataFragment = {
	__typename?: "UserSession";
	id: string;
	email: string;
	name?: string | null;
	role: Role;
};

export type IsLoggedInQueryVariables = Exact<{ [key: string]: never }>;

export type IsLoggedInQuery = {
	__typename?: "Query";
	session?: {
		__typename?: "UserSession";
		id: string;
		email: string;
		name?: string | null;
		role: Role;
	} | null;
};

export type LoginMutationVariables = Exact<{
	input: CreateSessionInput;
}>;

export type LoginMutation = {
	__typename?: "Mutation";
	createSession: {
		__typename?: "UserSession";
		id: string;
		email: string;
		name?: string | null;
		role: Role;
	};
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; deleteSession: boolean };

export const SessionDataFragmentDoc = `
    fragment SessionData on UserSession {
  id
  email
  name
  role
}
    `;
export const IsLoggedInDocument = `
    query IsLoggedIn {
  session {
    ...SessionData
  }
}
    ${SessionDataFragmentDoc}`;
export const useIsLoggedInQuery = <TData = IsLoggedInQuery, TError = ClientError>(
	client: GraphQLClient,
	variables?: IsLoggedInQueryVariables,
	options?: UseQueryOptions<IsLoggedInQuery, TError, TData>,
	headers?: RequestInit["headers"],
) =>
	useQuery<IsLoggedInQuery, TError, TData>(
		variables === undefined ? ["IsLoggedIn"] : ["IsLoggedIn", variables],
		fetcher<IsLoggedInQuery, IsLoggedInQueryVariables>(
			client,
			IsLoggedInDocument,
			variables,
			headers,
		),
		options,
	);

useIsLoggedInQuery.getKey = (variables?: IsLoggedInQueryVariables) =>
	variables === undefined ? ["IsLoggedIn"] : ["IsLoggedIn", variables];
export const LoginDocument = `
    mutation Login($input: CreateSessionInput!) {
  createSession(input: $input) {
    ...SessionData
  }
}
    ${SessionDataFragmentDoc}`;
export const useLoginMutation = <TError = ClientError, TContext = unknown>(
	client: GraphQLClient,
	options?: UseMutationOptions<LoginMutation, TError, LoginMutationVariables, TContext>,
	headers?: RequestInit["headers"],
) =>
	useMutation<LoginMutation, TError, LoginMutationVariables, TContext>(
		["Login"],
		(variables?: LoginMutationVariables) =>
			fetcher<LoginMutation, LoginMutationVariables>(client, LoginDocument, variables, headers)(),
		options,
	);
export const LogoutDocument = `
    mutation Logout {
  deleteSession
}
    `;
export const useLogoutMutation = <TError = ClientError, TContext = unknown>(
	client: GraphQLClient,
	options?: UseMutationOptions<LogoutMutation, TError, LogoutMutationVariables, TContext>,
	headers?: RequestInit["headers"],
) =>
	useMutation<LogoutMutation, TError, LogoutMutationVariables, TContext>(
		["Logout"],
		(variables?: LogoutMutationVariables) =>
			fetcher<LogoutMutation, LogoutMutationVariables>(
				client,
				LogoutDocument,
				variables,
				headers,
			)(),
		options,
	);
