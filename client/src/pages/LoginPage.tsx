import { useEffect } from "react";
import { Card, Center, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";

import { useUser } from "src/contexts/UserContext";
import { LoginForm } from "src/forms/LoginForm";

export const LoginPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    void navigate({ to: "/dashboard" });
  }, [navigate, user]);

  return user === null ? (
    <Center sx={{ height: "100vh" }}>
      <Stack spacing={12}>
        <Stack textAlign="center">
          <Heading size="md">Log in to your account</Heading>
        </Stack>
        <Card w={{ base: "90%", md: "500px" }} p={8}>
          <LoginForm />
        </Card>
      </Stack>
    </Center>
  ) : (
    <div />
  );
};
