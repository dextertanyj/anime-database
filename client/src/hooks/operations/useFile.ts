import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  CreateFileMutation,
  CreateFileMutationVariables,
  DeleteFileMutation,
  DeleteFileMutationVariables,
  UpdateFileMutation,
  UpdateFileMutationVariables,
  useCreateFileMutation,
  useDeleteFileMutation,
  useFileCodecsQuery,
  useFileEditableQuery,
  useFileQuery,
  useUpdateFileMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useFileEditable = ({ id }: { id: string }) => {
  return useFileEditableQuery(client, { id });
};

const useFile = ({ id }: { id: string }) => {
  return useFileQuery(client, { id });
};

const useFileCodecs = () => {
  return useFileCodecsQuery(client);
};

const useCreateFile = () => {
  const { mutate, data, error, isLoading, isError } = useCreateFileMutation(client);
  const fn = (
    variables: CreateFileMutationVariables,
    options?: MutateOptions<CreateFileMutation, ClientError, CreateFileMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useUpdateFile = () => {
  const { mutate, data, error, isLoading, isError } = useUpdateFileMutation(client);
  const fn = (
    variables: UpdateFileMutationVariables,
    options?: MutateOptions<UpdateFileMutation, ClientError, UpdateFileMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useFileQuery.getKey({ id: variables.id })]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useDeleteFile = () => {
  const { mutate, data, error, isLoading, isError } = useDeleteFileMutation(client);
  const fn = (
    variables: DeleteFileMutationVariables,
    options?: MutateOptions<DeleteFileMutation, ClientError, DeleteFileMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useFileQuery.getKey({ id: variables.id })]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const file = {
  useGetEditable: useFileEditable,
  useGet: useFile,
  useCreate: useCreateFile,
  useUpdate: useUpdateFile,
  useDelete: useDeleteFile,
  useGetAllCodecs: useFileCodecs,
} as const;
