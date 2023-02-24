import { MutateOptions, QueryClient, UseMutateFunction } from "@tanstack/react-query";

export const client = new QueryClient();

export const mutateWithInvalidation = <TData, TError, TVariables, TContext>(
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>,
  variables: TVariables,
  options?: MutateOptions<TData, TError, TVariables, TContext>,
  keys?: Array<Array<unknown>>,
) => {
  mutate(variables, {
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess && options.onSuccess(data, variables, context);
      if (!keys) {
        return;
      }
      for (const key of keys) {
        void client.invalidateQueries(key);
      }
    },
  });
};
