import { MutateOptions, useQueryClient } from "@tanstack/react-query";
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

export const useIsLoggedIn = () => {
  return useIsLoggedInQuery(client);
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, data, error, isLoading, isError } = useLoginMutation(client);
  const login = (
    variables: LoginMutationVariables,
    options?: MutateOptions<LoginMutation, ClientError, LoginMutationVariables>,
  ) => {
    mutate(variables, options);
    void queryClient.invalidateQueries(useIsLoggedInQuery.getKey());
  };
  return { mutate: login, data, error, isLoading, isError };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate, data, error, isLoading, isError } = useLogoutMutation(client);
  const logout = (
    options?: MutateOptions<LogoutMutation, ClientError, LogoutMutationVariables>,
  ) => {
    mutate({}, options);
    void queryClient.invalidateQueries(useIsLoggedInQuery.getKey());
  };
  return { mutate: logout, data, error, isLoading, isError };
};
