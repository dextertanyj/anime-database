import { FormControl, FormLabel, Heading, Select, Stack } from "@chakra-ui/react";

import { WatchStatus, WatchStatusType } from "src/generated/graphql";
import { useSetDefaultWatchStatus } from "src/hooks/useWatchStatus";
import { watchStatusTypeToDisplayString } from "src/utilities/watch-status.utilities";

export const DefaultWatchStatusPanel = ({
  statuses,
}: {
  statuses: Array<Pick<WatchStatus, "id" | "status" | "type">>;
}) => {
  const { mutate } = useSetDefaultWatchStatus();
  return (
    <Stack py={2} spacing={4} maxW="300px" pl={4}>
      <Heading size="sm">Defaults</Heading>
      {Object.values(WatchStatusType).map((type) => (
        <FormControl key={type}>
          <FormLabel>{watchStatusTypeToDisplayString(type)}</FormLabel>
          <Select
            onChange={(e) => mutate({ input: { type, id: e.target.value ?? null } })}
            defaultValue={statuses.find((value) => value.type === type)?.status}
          >
            {statuses.map((value) => (
              <option
                key={value.id}
                value={value.id}
                disabled={value.type ? value.type !== type : false}
              >
                {value.status}
              </option>
            ))}
            <option value={undefined}>None</option>
          </Select>
        </FormControl>
      ))}
    </Stack>
  );
};