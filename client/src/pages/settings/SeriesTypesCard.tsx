import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

import { EditableList } from "src/components/EditableList/EditableList";
import { seriesType } from "src/hooks/operations/useSeriesType";

import { SeriesTypeEntry } from "./SeriesTypeEntry";

export const SeriesTypesCard = () => {
  const { data } = seriesType.useGetAll();

  return (
    <Card h="full" w="full">
      <CardHeader pb={0}>
        <Heading size="md">Series Types</Heading>
      </CardHeader>
      <CardBody>
        {!data ? null : <EditableList data={data.seriesTypes} ListElement={SeriesTypeEntry} />}
      </CardBody>
    </Card>
  );
};
