import { useCallback } from "react";
import {
  FormControl,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { EditableListEntry } from "src/components/EditableList/EditableListEntry";
import { SeriesType } from "src/generated/graphql";
import { seriesType } from "src/hooks/operations/useSeriesType";

export const SeriesTypeEntry = (props: {
  data?: Pick<SeriesType, "id" | "type" | "singular">;
  onSubmit?: (data: Pick<SeriesType, "id" | "type" | "singular">) => void;
  onCancel?: () => void;
}) => {
  const { onSubmit: onSubmitCallback, ...rest } = props;
  const onSubmit = useCallback(
    (data: { createSeriesType: Pick<SeriesType, "id" | "type" | "singular"> }) =>
      onSubmitCallback && onSubmitCallback(data.createSeriesType),
    [onSubmitCallback],
  );

  return (
    <EditableListEntry
      defaultFormValues={{
        type: props.data?.type || "",
        singular: props.data?.singular || false,
      }}
      onSubmit={onSubmit}
      useCreate={seriesType.useCreate}
      useUpdate={seriesType.useUpdate}
      useDelete={seriesType.useDelete}
      {...rest}
    >
      {({ editMode }) => (
        <Wrap justify="space-between" w="full">
          <WrapItem>
            <Controller
              name="type"
              rules={{
                required: "Type is required.",
                validate: (value: string) => Boolean(value),
              }}
              render={({ field, fieldState: { error } }) =>
                editMode ? (
                  <FormControl display="flex" isInvalid={!!error}>
                    <Input minW={0} {...field} />
                  </FormControl>
                ) : (
                  <Text pl="17px">{field.value}</Text>
                )
              }
            />
          </WrapItem>
          <WrapItem>
            <Controller
              name="singular"
              render={({ field, fieldState: { error } }) => (
                <FormControl display="flex" w="auto" isInvalid={!!error}>
                  <RadioGroup
                    isDisabled={!editMode}
                    {...field}
                    onChange={(value) => field.onChange(value === "true" ? true : false)}
                    value={field.value ? "true" : "false"}
                  >
                    <HStack pl={editMode ? "0px" : "17px"} spacing={4}>
                      <Radio value="true">Single</Radio>
                      <Radio value="false">Multiple</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              )}
            />
          </WrapItem>
        </Wrap>
      )}
    </EditableListEntry>
  );
};
