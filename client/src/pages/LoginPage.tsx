import { useEffect, useState } from "react";
import { Card, Center, Heading, Stack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { To, useLocation, useNavigate } from "react-router-dom";

import { LoginForm } from "src/forms/LoginForm";
import { IsLoggedInQuery, useIsLoggedInQuery } from "src/generated/graphql";
import { useIsSetup } from "src/hooks/useSetup";
import { client as gqlClient } from "src/services/graphql-client.service";

export const LoginPage = () => {
  const { data } = useIsSetup();
  const navigate = useNavigate();
  const location = useLocation();
  const client = useQueryClient();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!data || data.setup) {
      return;
    }
    navigate("setup");
  }, [navigate, data]);

  useEffect(() => {
    void (async () => {
      const { session } = await client.ensureQueryData<IsLoggedInQuery>(
        useIsLoggedInQuery.getKey(),
        () => {
          return gqlClient.request<IsLoggedInQuery>(useIsLoggedInQuery.document);
        },
      );
      if (session) {
        navigate("dashboard");
      } else {
        setLoaded(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data?.setup === false || !loaded ? null : (
    <Center sx={{ height: "100vh" }}>
      <Stack spacing={12}>
        <Stack textAlign="center">
          <Heading size="md">Log in to your account</Heading>
        </Stack>
        <Card w={{ base: "90%", md: "500px" }} p={8}>
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
          <LoginForm redirect={location.state?.redirect as To} />
        </Card>
      </Stack>
    </Center>
  );
};
