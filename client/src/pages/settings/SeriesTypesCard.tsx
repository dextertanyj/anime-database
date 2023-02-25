import { useCallback, useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Heading, Stack } from "@chakra-ui/react";

import { BiPlus } from "react-icons/bi";
import { SeriesType } from "src/generated/graphql";
import { seriesType } from "src/hooks/operations/useSeriesType";

import { SeriesTypeEntry } from "./SeriesTypeEntry";

export const SeriesTypesCard = () => {
  const { data } = seriesType.useGetAll();
  const [created, setCreated] = useState<Array<Pick<SeriesType, "id" | "type"> | undefined | null>>(
    [],
  );

  const onClick = useCallback(() => {
    setCreated((val) => [...val, undefined]);
  }, []);

  const onSubmit = useCallback((idx: number, data: Pick<SeriesType, "id" | "type">) => {
    setCreated((val) => {
      const copy = [...val];
      copy[idx] = { ...data };
      return copy;
    });
  }, []);

  const onCancel = useCallback((idx: number) => {
    setCreated((val) => {
      const copy = [...val];
      copy[idx] = null;
      return copy;
    });
  }, []);

  return (
    <Card>
      <CardHeader pb={0}>
        <Heading size="md">Series Types</Heading>
      </CardHeader>
      <CardBody>
        <Stack py={2} spacing={4} maxW="400px" divider={<Divider />}>
          {data?.seriesTypes
            .filter((val) => !created.find((created) => created?.id === val.id))
            .sort((lhs, rhs) => (lhs.id < rhs.id ? -1 : 1))
            .map((value) => (
              <SeriesTypeEntry key={value.id} data={value} />
            ))}
          {created.map((val, idx) =>
            val !== null ? (
              <SeriesTypeEntry
                key={val ? val.id : idx}
                data={val}
                onSubmit={(data) => onSubmit(idx, data)}
                onCancel={() => onCancel(idx)}
              />
            ) : null,
          )}
          <Button leftIcon={<BiPlus />} onClick={onClick}>
            Add
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};
