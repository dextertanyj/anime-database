import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  SetConfigurationMutation,
  SetConfigurationMutationVariables,
  SetConfigurationsMutation,
  SetConfigurationsMutationVariables,
  useConfigurationQuery,
  useConfigurationsQuery,
  useSetConfigurationMutation,
  useSetConfigurationsMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useConfiguration = ({ key }: { key: string }) => {
  return useConfigurationQuery(client, { key });
};

const useConfigurations = () => {
  return useConfigurationsQuery(client);
};

const useSetConfiguration = ({ key }: { key: string }) => {
  const { mutate, data, error, isLoading, isError } = useSetConfigurationMutation(client);
  const fn = (
    variables: SetConfigurationMutationVariables,
    options?: MutateOptions<
      SetConfigurationMutation,
      ClientError,
      SetConfigurationMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [
      useConfigurationsQuery.getKey(),
      useConfigurationQuery.getKey({ key }),
    ]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

const useSetConfigurations = ({ keys }: { keys: string[] }) => {
  const { mutate, data, error, isLoading, isError } = useSetConfigurationsMutation(client);
  const fn = (
    variables: SetConfigurationsMutationVariables,
    options?: MutateOptions<
      SetConfigurationsMutation,
      ClientError,
      SetConfigurationsMutationVariables
    >,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [
      useConfigurationsQuery.getKey(),
      keys.map((key) => useConfigurationQuery.getKey({ key })),
    ]);
  };
  return { mutate: fn, data, error, isLoading, isError };
};

export const configuration = {
  useGet: useConfiguration,
  useGetAll: useConfigurations,
  useSet: useSetConfiguration,
  useSetMultiple: useSetConfigurations,
} as const;
