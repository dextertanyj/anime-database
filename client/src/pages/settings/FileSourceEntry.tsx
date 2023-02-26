import { useCallback } from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { EditableListEntry } from "src/components/EditableList/EditableListEntry";
import { FileSource } from "src/generated/graphql";
import { fileSource } from "src/hooks/operations/useFileSource";

export const FileSourceEntry = (props: {
  data?: Pick<FileSource, "id" | "source">;
  onSubmit?: (data: Pick<FileSource, "id" | "source">) => void;
  onCancel?: () => void;
}) => {
  const { onSubmit: onSubmitCallback, ...rest } = props;
  const onSubmit = useCallback(
    (data: { createFileSource: Pick<FileSource, "id" | "source"> }) =>
      onSubmitCallback && onSubmitCallback(data.createFileSource),
    [onSubmitCallback],
  );
  return (
    <EditableListEntry
      defaultFormValues={{
        source: props.data?.source || "",
      }}
      onSubmit={onSubmit}
      useCreate={fileSource.useCreate}
      useUpdate={fileSource.useUpdate}
      useDelete={fileSource.useDelete}
      {...rest}
    >
      {({ editMode }) => (
        <Controller
          name="source"
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
