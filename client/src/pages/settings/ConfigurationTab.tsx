import { Grid, GridItem } from "@chakra-ui/react";

import { FileSourceCard } from "./FileSourceCard";
import { SeriesTypesCard } from "./SeriesTypesCard";
import { WatchStatusCard } from "./WatchStatusCard";

export const ConfigurationTab = () => {
  return (
    <Grid py={4} templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gap={6}>
      <GridItem>
        <SeriesTypesCard />
      </GridItem>
      <GridItem>
        <FileSourceCard />
      </GridItem>
      <GridItem colSpan={2}>
        <WatchStatusCard />
      </GridItem>
    </Grid>
  );
};
