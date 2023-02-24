import { Card, CardBody, CardHeader, Stack, Text } from "@chakra-ui/react";

import { WatchStatusManagementCard } from "./WatchStatusManagementCard";

export const ConfigurationTab = () => {
  return (
    <Stack py={4} spacing={6}>
      <Card>
        <CardHeader>Series Types</CardHeader>
        <CardBody>
          <Text>Placeholder</Text>
        </CardBody>
      </Card>
      <WatchStatusManagementCard />
    </Stack>
  );
};
