import { useEffect } from "react";
import { Card, Center, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useUser } from "src/contexts/UserContext";
import { LoginForm } from "src/forms/LoginForm";
import { useIsSetup } from "src/hooks/useSetup";

export const LoginPage = () => {
  const { data } = useIsSetup();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data || data.setup) {
      return;
    }
    navigate("setup");
  }, [navigate, data]);

  useEffect(() => {
    if (!user) {
      return;
    }
    navigate("dashboard");
  }, [navigate, user]);

  return data?.setup === false || user !== null ? null : (
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
  );
};
