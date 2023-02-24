import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";

import {
  LoginMutation,
  LoginMutationVariables,
  LogoutMutation,
  LogoutMutationVariables,
  useIsLoggedInQuery,
  useLoginMutation,
  useLogoutMutation,
} from "src/generated/graphql";
import { client } from "src/services/graphql-client.service";
import { mutateWithInvalidation } from "src/services/query-client.service";

const useIsLoggedIn = () => {
  return useIsLoggedInQuery(client);
};

const useLogin = () => {
  const { mutate, data, error, isLoading, isError } = useLoginMutation(client);
  const login = (
    variables: LoginMutationVariables,
    options?: MutateOptions<LoginMutation, ClientError, LoginMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, variables, options, [useIsLoggedInQuery.getKey()]);
  };
  return { mutate: login, data, error, isLoading, isError };
};

const useLogout = () => {
  const { mutate, data, error, isLoading, isError } = useLogoutMutation(client);
  const logout = (
    options?: MutateOptions<LogoutMutation, ClientError, LogoutMutationVariables>,
  ) => {
    mutateWithInvalidation(mutate, {}, options, [useIsLoggedInQuery.getKey()]);
  };
  return { mutate: logout, data, error, isLoading, isError };
};

export const session = {
  useGet: useIsLoggedIn,
  useCreate: useLogin,
  useDelete: useLogout,
} as const;
