import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  CreateFileSourceMutation,
  CreateFileSourceMutationVariables,
  DeleteFileSourceMutation,
  DeleteFileSourceMutationVariables,
  UpdateFileSourceMutation,
  UpdateFileSourceMutationVariables,
  useCreateFileSourceMutation,
  useDeleteFileSourceMutation,
  useFileSourcesQuery,
  useUpdateFileSourceMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useFileSources = () => {
  return useFileSourcesQuery(client);
};

const useCreateFileSource = () => {
  const { mutate, data, error, isLoading, isError } = useCreateFileSourceMutation(client);
  const fn = (
    variables: CreateFileSourceMutationVariables,
    options?: MutateOptions<
      CreateFileSourceMutation,
      ClientError,
      CreateFileSourceMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useFileSourcesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useUpdateFileSource = () => {
  const { mutate, data, error, isLoading, isError } = useUpdateFileSourceMutation(client);
  const fn = (
    variables: UpdateFileSourceMutationVariables,
    options?: MutateOptions<
      UpdateFileSourceMutation,
      ClientError,
      UpdateFileSourceMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useFileSourcesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useDeleteFileSource = () => {
  const { mutate, data, error, isLoading, isError } = useDeleteFileSourceMutation(client);
  const fn = (
    variables: DeleteFileSourceMutationVariables,
    options?: MutateOptions<
      DeleteFileSourceMutation,
      ClientError,
      DeleteFileSourceMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useFileSourcesQuery.getKey()]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const fileSource = {
  useGetAll: useFileSources,
  useCreate: useCreateFileSource,
  useUpdate: useUpdateFileSource,
  useDelete: useDeleteFileSource,
} as const;
