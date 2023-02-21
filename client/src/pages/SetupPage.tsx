import { useEffect } from "react";
import { Card, Center, Heading, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SetupForm } from "src/forms/SetupForm";
import { useIsSetup } from "src/hooks/useSetup";

export const SetupPage = () => {
  const navigate = useNavigate();
  const { data } = useIsSetup();

  useEffect(() => {
    if (!data || !data.setup) {
      return;
    }
    navigate("/");
  }, [data, navigate]);

  return !data ? null : (
    <Center sx={{ height: "100vh" }}>
      <Stack spacing={12}>
        <Stack textAlign="center">
          <Heading size="md">Setup initial administrator account</Heading>
        </Stack>
        <Card w={{ base: "90%", md: "500px" }} p={8}>
          <SetupForm />
        </Card>
      </Stack>
    </Center>
  );
};
