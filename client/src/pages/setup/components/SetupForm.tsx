import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { PasswordInput } from "src/components/PasswordInput";
import { useUser } from "src/contexts/UserContext";
import { setup } from "src/hooks/operations/useSetup";
import isEmail from "validator/es/lib/isEmail";
import isStrongPassword from "validator/es/lib/isStrongPassword";

type SetupFormState = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
};

export const SetupForm = () => {
  const methods = useForm<SetupFormState>();
  const toast = useToast({ position: "top" });

  const { mutate } = setup.useCreate();
  const { login } = useUser();

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: SetupFormState) => {
    const { passwordConfirmation: _, ...rest } = data;
    mutate(
      { input: rest },
      {
        onSuccess: () => {
          toast({ description: "Successfully created account.", status: "success" });
          login({ input: { email: rest.email, password: rest.password } }, "settings");
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <Stack spacing={5}>
            <Controller
              name="email"
              defaultValue={""}
              rules={{
                required: "Email is required.",
                validate: (value: string) => isEmail(value) || "Please enter a valid email.",
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="name"
              defaultValue={""}
              rules={{
                required: "Name is required.",
                minLength: {
                  value: 3,
                  message: "Display name must be at least 3 characters long.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="password"
              defaultValue={""}
              rules={{
                required: "Password is required.",
                validate: (value: string) => {
                  return (
                    isStrongPassword(value) ||
                    "Password must contain an uppercase character, lowercase character, symbol, number, and be at least 8 characters long."
                  );
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <PasswordInput isInvalid={!!error} {...field} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="passwordConfirmation"
              defaultValue={""}
              rules={{
                required: "Password confirmation is required.",
                validate: (value: string) => {
                  return getValues("password") === value || "Passwords do not match.";
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel htmlFor="passwordConfirmation">Confirm Password</FormLabel>
                  <PasswordInput isInvalid={!!error} {...field} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </Stack>
          <Stack spacing="6">
            <Button type="submit" isLoading={isSubmitting}>
              Setup
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};
