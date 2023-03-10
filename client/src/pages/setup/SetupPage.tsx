import { useEffect, useState } from "react";
import { Card, Center, Heading, Stack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { IsSetupQuery, useIsSetupQuery } from "src/generated/graphql";
import { client as gqlClient } from "src/services/graphql-client.service";

import { SetupForm } from "./components/SetupForm";

export const SetupPage = () => {
  const navigate = useNavigate();
  const client = useQueryClient();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      const { setup } = await client.ensureQueryData<IsSetupQuery>(useIsSetupQuery.getKey(), () => {
        return gqlClient.request<IsSetupQuery>(useIsSetupQuery.document);
      });
      if (setup) {
        navigate("/");
      } else {
        setLoaded(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !loaded ? null : (
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
