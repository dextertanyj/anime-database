import { useCallback } from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import tinycolor from "tinycolor2";

import { ColorPicker } from "src/components/ColorPicker";
import { EditableListEntry } from "src/components/EditableList/EditableListEntry";
import { WatchStatus } from "src/generated/graphql";
import { watchStatus } from "src/hooks/operations/useWatchStatus";

export const WatchStatusEntry = (props: {
  data?: Pick<WatchStatus, "id" | "status" | "color">;
  onSubmit?: (data: Pick<WatchStatus, "id" | "status" | "color">) => void;
  onCancel?: () => void;
}) => {
  const { onSubmit: onSubmitCallback, ...rest } = props;
  const onSubmit = useCallback(
    (data: { createWatchStatus: Pick<WatchStatus, "id" | "status" | "color"> }) =>
      onSubmitCallback && onSubmitCallback(data.createWatchStatus),
    [onSubmitCallback],
  );
  return (
    <EditableListEntry
      defaultFormValues={{
        color: props.data?.color ?? tinycolor.random().toHexString().toUpperCase(),
        status: props.data?.status || "",
      }}
      onSubmit={onSubmit}
      useCreate={watchStatus.useCreate}
      useUpdate={watchStatus.useUpdate}
      useDelete={watchStatus.useDelete}
      {...rest}
    >
      {({ editMode }) => (
        <>
          <Controller
            name="color"
            render={({ field }) => <ColorPicker {...field} isDisabled={!editMode} />}
          />
          <Controller
            name="status"
            rules={{
              required: "Name is required.",
              validate: (value: string) => Boolean(value),
            }}
            render={({ field, fieldState: { error } }) =>
              editMode ? (
                <FormControl w="auto" isInvalid={!!error}>
                  <Input w="auto" {...field} />
                </FormControl>
              ) : (
                <Text pl="17px">{field.value}</Text>
              )
            }
          />
        </>
      )}
    </EditableListEntry>
  );
};
