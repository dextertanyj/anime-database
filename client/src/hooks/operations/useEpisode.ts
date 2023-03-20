import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  CreateEpisodeMutation,
  CreateEpisodeMutationVariables,
  DeleteEpisodeMutation,
  DeleteEpisodeMutationVariables,
  UpdateEpisodeMutation,
  UpdateEpisodeMutationVariables,
  useCreateEpisodeMutation,
  useDeleteEpisodeMutation,
  useEpisodeEditableQuery,
  useEpisodeQuery,
  useUpdateEpisodeMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useEpisodeEditable = ({ id }: { id: string }) => {
  return useEpisodeEditableQuery(client, { id });
};

const useEpisode = ({ id }: { id: string }) => {
  return useEpisodeQuery(client, { id });
};

const useCreateEpisode = () => {
  const { mutate, data, error, isLoading, isError } = useCreateEpisodeMutation(client);
  const fn = (
    variables: CreateEpisodeMutationVariables,
    options?: MutateOptions<CreateEpisodeMutation, ClientError, CreateEpisodeMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useUpdateEpisode = () => {
  const { mutate, data, error, isLoading, isError } = useUpdateEpisodeMutation(client);
  const fn = (
    variables: UpdateEpisodeMutationVariables,
    options?: MutateOptions<UpdateEpisodeMutation, ClientError, UpdateEpisodeMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [
      useEpisodeQuery.getKey({ id: variables.id }),
    ]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useDeleteEpisode = () => {
  const { mutate, data, error, isLoading, isError } = useDeleteEpisodeMutation(client);
  const fn = (
    variables: DeleteEpisodeMutationVariables,
    options?: MutateOptions<DeleteEpisodeMutation, ClientError, DeleteEpisodeMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [
      useEpisodeQuery.getKey({ id: variables.id }),
    ]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const episode = {
  useGetEditable: useEpisodeEditable,
  useGet: useEpisode,
  useCreate: useCreateEpisode,
  useUpdate: useUpdateEpisode,
  useDelete: useDeleteEpisode,
} as const;
