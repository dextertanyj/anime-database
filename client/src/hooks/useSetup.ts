import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  SetupMutation,
  SetupMutationVariables,
  useIsSetupQuery,
  useSetupMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

export const useIsSetup = () => {
  return useIsSetupQuery(client);
};

export const useSetup = () => {
  const { mutate, data, error, isLoading, isError } = useSetupMutation(client);
  const setup = (
    variables: SetupMutationVariables,
    options?: MutateOptions<SetupMutation, ClientError, SetupMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useIsSetupQuery.getKey()]);
  };
  return { mutate: setup, data, error, isLoading, isError };
};
