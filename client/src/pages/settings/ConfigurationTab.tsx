import { Stack } from "@chakra-ui/react";

import { SeriesTypesCard } from "./SeriesTypesCard";
import { WatchStatusCard } from "./WatchStatusCard";

export const ConfigurationTab = () => {
  return (
    <Stack py={4} spacing={6}>
      <SeriesTypesCard />
      <WatchStatusCard />
    </Stack>
  );
};
