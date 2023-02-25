import { useCallback, useMemo, useState } from "react";
import { FormControl, HStack, IconButton, Input, Text } from "@chakra-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { BiEdit, BiSave, BiTrash, BiXCircle } from "react-icons/bi";
import { SeriesType } from "src/generated/graphql";
import { seriesType } from "src/hooks/operations/useSeriesType";

type SeriesTypeEditFormState = {
  type: string;
};

export const SeriesTypeEntry = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCancel = () => {},
}: {
  data?: Pick<SeriesType, "id" | "type">;
  onSubmit?: (data: Pick<SeriesType, "id" | "type">) => void;
  onCancel?: () => void;
}) => {
  const [editMode, setEditMode] = useState<boolean>(data ? false : true);
  const { mutate: create } = seriesType.useCreate();
  const { mutate: update } = seriesType.useUpdate();
  const { mutate: remove } = seriesType.useDelete();
  const methods = useForm<SeriesTypeEditFormState>({ reValidateMode: "onChange" });
  const { handleSubmit } = methods;

  const onSubmitCallback = useCallback(
    () =>
      handleSubmit(({ type }) => {
        if (data?.id) {
          update({ id: data.id, input: { type } });
        } else {
          create(
            { input: { type } },
            { onSuccess: ({ createSeriesType: data }) => onSubmit(data) },
          );
        }
      })(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.id, handleSubmit, update],
  );

  const onDelete = useCallback(() => {
    if (!data?.id) {
      return;
    }
    remove({ id: data.id });
  }, [data?.id, remove]);

  const onCancelCallback = useCallback(() => {
    if (data?.id) {
      setEditMode(false);
    } else {
      onCancel();
    }
  }, [data?.id, onCancel]);

  const allowSave = useMemo(() => !!methods.formState.isValid, [methods.formState]);

  return (
    <HStack justifyContent="space-between">
      <HStack spacing={2}>
        <FormProvider {...methods}>
          <Controller
            name="type"
            defaultValue={data?.type || undefined}
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
        </FormProvider>
      </HStack>
      <HStack>
        <IconButton
          aria-label="edit"
          variant="ghost"
          isDisabled={editMode && !allowSave}
          icon={editMode ? <BiSave /> : <BiEdit />}
          onClick={
            editMode
              ? () => onSubmitCallback().then(() => setEditMode((val) => !val))
              : () => setEditMode((val) => !val)
          }
        />
        <IconButton
          aria-label="delete"
          variant="ghost"
          colorScheme="red"
          icon={data?.id && !editMode ? <BiTrash /> : <BiXCircle />}
          onClick={!editMode ? onDelete : onCancelCallback}
        />
      </HStack>
    </HStack>
  );
};
