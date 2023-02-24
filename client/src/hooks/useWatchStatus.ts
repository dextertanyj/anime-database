import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  CreateWatchStatusMutation,
  CreateWatchStatusMutationVariables,
  DeleteWatchStatusMutation,
  DeleteWatchStatusMutationVariables,
  SetDefaultWatchStatusMutation,
  SetDefaultWatchStatusMutationVariables,
  UpdateWatchStatusMutation,
  UpdateWatchStatusMutationVariables,
  useCreateWatchStatusMutation,
  useDeleteWatchStatusMutation,
  useSetDefaultWatchStatusMutation,
  useUpdateWatchStatusMutation,
  useWatchStatusesQuery,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

export const useWatchStatuses = () => {
  return useWatchStatusesQuery(client);
};

export const useCreateWatchStatus = () => {
  const { mutate, data, error, isLoading, isError } = useCreateWatchStatusMutation(client);
  const fn = (
    variables: CreateWatchStatusMutationVariables,
    options?: MutateOptions<
      CreateWatchStatusMutation,
      ClientError,
      CreateWatchStatusMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useWatchStatusesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const useUpdateWatchStatus = () => {
  const { mutate, data, error, isLoading, isError } = useUpdateWatchStatusMutation(client);
  const fn = (
    variables: UpdateWatchStatusMutationVariables,
    options?: MutateOptions<
      UpdateWatchStatusMutation,
      ClientError,
      UpdateWatchStatusMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useWatchStatusesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const useDeleteWatchStatus = () => {
  const { mutate, data, error, isLoading, isError } = useDeleteWatchStatusMutation(client);
  const fn = (
    variables: DeleteWatchStatusMutationVariables,
    options?: MutateOptions<
      DeleteWatchStatusMutation,
      ClientError,
      DeleteWatchStatusMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useWatchStatusesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const useSetDefaultWatchStatus = () => {
  const { mutate, data, error, isLoading, isError } = useSetDefaultWatchStatusMutation(client);
  const fn = (
    variables: SetDefaultWatchStatusMutationVariables,
    options?: MutateOptions<
      SetDefaultWatchStatusMutation,
      ClientError,
      SetDefaultWatchStatusMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useWatchStatusesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};
