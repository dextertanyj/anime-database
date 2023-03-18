import { Grid, GridItem } from "@chakra-ui/react";

import { FileSourceCard } from "./FileSourceCard";
import { SeriesTypesCard } from "./SeriesTypesCard";
import { WatchStatusCard } from "./WatchStatusCard";

export const ConfigurationTab = () => {
  return (
    <Grid
      w="full"
      py={4}
      gridTemplateColumns="repeat(auto-fit, minmax(min(100%, max(350px, calc((100% - var(--chakra-space-6))/ 2))), 1fr))"
      gap={6}
    >
      <GridItem>
        <SeriesTypesCard />
      </GridItem>
      <GridItem>
        <FileSourceCard />
      </GridItem>
      <GridItem gridColumn="1 / -1">
        <WatchStatusCard />
      </GridItem>
    </Grid>
  );
};
