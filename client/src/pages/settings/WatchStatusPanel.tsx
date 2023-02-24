import { useCallback, useState } from "react";
import { Button, Divider, Stack } from "@chakra-ui/react";

import { BiPlus } from "react-icons/bi";
import { WatchStatus } from "src/generated/graphql";

import { WatchStatusEntry } from "./WatchStatusEntry";

export const WatchStatusPanel = ({
  statuses,
}: {
  statuses: Array<Pick<WatchStatus, "id" | "status" | "color">>;
}) => {
  const [created, setCreated] = useState<
    Array<Pick<WatchStatus, "id" | "status" | "color"> | undefined | null>
  >([]);

  const onClick = useCallback(() => {
    setCreated((val) => [...val, undefined]);
  }, []);

  const onSubmit = useCallback(
    (idx: number, data: Pick<WatchStatus, "id" | "status" | "color">) => {
      setCreated((val) => {
        const copy = [...val];
        copy[idx] = { ...data };
        return copy;
      });
    },
    [],
  );

  const onCancel = useCallback((idx: number) => {
    setCreated((val) => {
      const copy = [...val];
      copy[idx] = null;
      return copy;
    });
  }, []);

  return (
    <Stack py={2} spacing={4} maxW="400px" divider={<Divider />}>
      {statuses
        .filter((val) => !created.find((created) => created?.id === val.id))
        .sort((lhs, rhs) => (lhs.id < rhs.id ? -1 : 1))
        .map((value) => (
          <WatchStatusEntry key={value.id} data={value} />
        ))}
      {created.map((val, idx) =>
        val !== null ? (
          <WatchStatusEntry
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
  );
};
