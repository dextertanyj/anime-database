import { Card, CardBody, CardHeader, Heading, Stack } from "@chakra-ui/react";

import { AniDBIntegrationForm } from "../forms/AniDBIntegrationForm";

export const AniDBIntegrationTab = () => {
  return (
    <Card h="full" w="full" my={4}>
      <CardHeader pb={0}>
        <Heading size="md">AniDB Client</Heading>
      </CardHeader>
      <CardBody>
        <Stack>
          <AniDBIntegrationForm />
        </Stack>
      </CardBody>
    </Card>
  );
};
