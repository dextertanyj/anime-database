import { useCallback } from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { EditableListEntry } from "src/components/EditableList/EditableListEntry";
import { SeriesType } from "src/generated/graphql";
import { seriesType } from "src/hooks/operations/useSeriesType";

export const SeriesTypeEntry = (props: {
  data?: Pick<SeriesType, "id" | "type">;
  onSubmit?: (data: Pick<SeriesType, "id" | "type">) => void;
  onCancel?: () => void;
}) => {
  const { onSubmit: onSubmitCallback, ...rest } = props;
  const onSubmit = useCallback(
    (data: { createSeriesType: Pick<SeriesType, "id" | "type"> }) =>
      onSubmitCallback && onSubmitCallback(data.createSeriesType),
    [onSubmitCallback],
  );
  return (
    <EditableListEntry
      defaultFormValues={{
        type: props.data?.type || "",
      }}
      onSubmit={onSubmit}
      useCreate={seriesType.useCreate}
      useUpdate={seriesType.useUpdate}
      useDelete={seriesType.useDelete}
      {...rest}
    >
      {({ editMode }) => (
        <Controller
          name="type"
          rules={{
            required: "Type is required.",
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
      )}
    </EditableListEntry>
  );
};
