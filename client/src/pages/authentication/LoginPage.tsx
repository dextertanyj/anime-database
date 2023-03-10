import { useEffect, useState } from "react";
import { Card, Center, Heading, Stack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { To, useLocation, useNavigate } from "react-router-dom";

import { IsLoggedInQuery, useIsLoggedInQuery } from "src/generated/graphql";
import { setup } from "src/hooks/operations/useSetup";
import { client as gqlClient } from "src/services/graphql-client.service";

import { LoginForm } from "./components/LoginForm";

export const LoginPage = () => {
  const { data } = setup.useGet();
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
