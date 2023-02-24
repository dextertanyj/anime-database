import { MutateOptions, useQueryClient } from "@tanstack/react-query";
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

export const useWatchStatuses = () => {
  return useWatchStatusesQuery(client);
};

export const useCreateWatchStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, data, error, isLoading, isError } = useCreateWatchStatusMutation(client);
  const fn = (
    variables: CreateWatchStatusMutationVariables,
    options?: MutateOptions<
      CreateWatchStatusMutation,
      ClientError,
      CreateWatchStatusMutationVariables
    >,
  ) => {
    mutate(variables, options);
    void queryClient.invalidateQueries(useWatchStatusesQuery.getKey());
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const useUpdateWatchStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, data, error, isLoading, isError } = useUpdateWatchStatusMutation(client);
  const fn = (
    variables: UpdateWatchStatusMutationVariables,
    options?: MutateOptions<
      UpdateWatchStatusMutation,
      ClientError,
      UpdateWatchStatusMutationVariables
    >,
  ) => {
    mutate(variables, options);
    void queryClient.invalidateQueries(useWatchStatusesQuery.getKey());
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const useDeleteWatchStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, data, error, isLoading, isError } = useDeleteWatchStatusMutation(client);
  const fn = (
    variables: DeleteWatchStatusMutationVariables,
    options?: MutateOptions<
      DeleteWatchStatusMutation,
      ClientError,
      DeleteWatchStatusMutationVariables
    >,
  ) => {
    mutate(variables, options);
    void queryClient.invalidateQueries(useWatchStatusesQuery.getKey());
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const useSetDefaultWatchStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, data, error, isLoading, isError } = useSetDefaultWatchStatusMutation(client);
  const fn = (
    variables: SetDefaultWatchStatusMutationVariables,
    options?: MutateOptions<
      SetDefaultWatchStatusMutation,
      ClientError,
      SetDefaultWatchStatusMutationVariables
    >,
  ) => {
    mutate(variables, options);
    void queryClient.invalidateQueries(useWatchStatusesQuery.getKey());
  };
  return { mutate: fn, data, error, isLoading, isError };
};
