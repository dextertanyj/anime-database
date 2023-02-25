import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  CreateSeriesTypeMutation,
  CreateSeriesTypeMutationVariables,
  DeleteSeriesTypeMutation,
  DeleteSeriesTypeMutationVariables,
  UpdateSeriesTypeMutation,
  UpdateSeriesTypeMutationVariables,
  useCreateSeriesTypeMutation,
  useDeleteSeriesTypeMutation,
  useSeriesTypesQuery,
  useUpdateSeriesTypeMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useSeriesTypes = () => {
  return useSeriesTypesQuery(client);
};

const useCreateSeriesType = () => {
  const { mutate, data, error, isLoading, isError } = useCreateSeriesTypeMutation(client);
  const fn = (
    variables: CreateSeriesTypeMutationVariables,
    options?: MutateOptions<
      CreateSeriesTypeMutation,
      ClientError,
      CreateSeriesTypeMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useSeriesTypesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useUpdateSeriesType = () => {
  const { mutate, data, error, isLoading, isError } = useUpdateSeriesTypeMutation(client);
  const fn = (
    variables: UpdateSeriesTypeMutationVariables,
    options?: MutateOptions<
      UpdateSeriesTypeMutation,
      ClientError,
      UpdateSeriesTypeMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useSeriesTypesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useDeleteSeriesType = () => {
  const { mutate, data, error, isLoading, isError } = useDeleteSeriesTypeMutation(client);
  const fn = (
    variables: DeleteSeriesTypeMutationVariables,
    options?: MutateOptions<
      DeleteSeriesTypeMutation,
      ClientError,
      DeleteSeriesTypeMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useSeriesTypesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const seriesType = {
  useGetAll: useSeriesTypes,
  useCreate: useCreateSeriesType,
  useUpdate: useUpdateSeriesType,
  useDelete: useDeleteSeriesType,
} as const;
