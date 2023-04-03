import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { To } from "react-router-dom";

import { PasswordInput } from "src/components/PasswordInput";
import { useUser } from "src/contexts/UserContext";

type LoginFormState = {
  email: string;
  password: string;
};

export const LoginForm = ({ redirect }: { redirect?: To }) => {
  const methods = useForm<LoginFormState>();
  const { login } = useUser();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: LoginFormState) => {
    login({ input: data }, redirect);
  };

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <Stack spacing={5}>
            <Box>
              <Controller
                name="email"
                defaultValue={""}
                rules={{
                  required: "Email is required.",
                  validate: (value: string) => Boolean(value),
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl isInvalid={!!error}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input type="email" {...field} />
                    <FormErrorMessage>{error && error.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
            </Box>
            <Box>
              <Controller
                name="password"
                defaultValue={""}
                rules={{
                  required: "Password is required.",
                  validate: (value: string) => Boolean(value),
                }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl isInvalid={!!error}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <PasswordInput isInvalid={!!error} {...field} />
                    <FormErrorMessage>{error && error.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
            </Box>
          </Stack>

          <Stack spacing="6">
            <Button type="submit" isLoading={isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
