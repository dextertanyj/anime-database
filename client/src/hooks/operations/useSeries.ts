import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  CreateSeriesMutation,
  CreateSeriesMutationVariables,
  DeleteSeriesMutation,
  DeleteSeriesMutationVariables,
  UpdateSeriesMutation,
  UpdateSeriesMutationVariables,
  useCreateSeriesMutation,
  useDeleteSeriesMutation,
  useReferenceSourcesQuery,
  useSeriesEditableQuery,
  useSeriesesQuery,
  useSeriesMetadataQuery,
  useSeriesQuery,
  useUpdateSeriesMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useSeriesMetadata = ({ id }: { id: string }) => {
  return useSeriesMetadataQuery(client, { id });
};

const useSeriesEditable = ({ id }: { id: string }) => {
  return useSeriesEditableQuery(client, { id });
};

const useSeries = ({ id }: { id: string }) => {
  return useSeriesQuery(client, { id });
};

const useSerieses = () => {
  return useSeriesesQuery(client);
};

const useReferenceSources = () => {
  return useReferenceSourcesQuery(client);
};

const useCreateSeries = () => {
  const { mutate, data, error, isLoading, isError } = useCreateSeriesMutation(client);
  const fn = (
    variables: CreateSeriesMutationVariables,
    options?: MutateOptions<CreateSeriesMutation, ClientError, CreateSeriesMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useSeriesesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useUpdateSeries = () => {
  const { mutate, data, error, isLoading, isError } = useUpdateSeriesMutation(client);
  const fn = (
    variables: UpdateSeriesMutationVariables,
    options?: MutateOptions<UpdateSeriesMutation, ClientError, UpdateSeriesMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [
      useSeriesQuery.getKey({ id: variables.id }),
      useSeriesesQuery.getKey(),
    ]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useDeleteSeries = () => {
  const { mutate, data, error, isLoading, isError } = useDeleteSeriesMutation(client);
  const fn = (
    variables: DeleteSeriesMutationVariables,
    options?: MutateOptions<DeleteSeriesMutation, ClientError, DeleteSeriesMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [
      useSeriesQuery.getKey({ id: variables.id }),
      useSeriesesQuery.getKey(),
    ]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const series = {
  useGetMetadata: useSeriesMetadata,
  useGetEditable: useSeriesEditable,
  useGet: useSeries,
  useGetAll: useSerieses,
  useCreate: useCreateSeries,
  useUpdate: useUpdateSeries,
  useDelete: useDeleteSeries,
  useGetAllSources: useReferenceSources,
} as const;
