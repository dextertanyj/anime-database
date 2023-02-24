import { useCallback, useMemo, useState } from "react";
import { FormControl, HStack, IconButton, Input, Text } from "@chakra-ui/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import tinycolor from "tinycolor2";

import { BiEdit, BiSave, BiTrash, BiXCircle } from "react-icons/bi";
import { ColorPicker } from "src/components/ColorPicker";
import { WatchStatus } from "src/generated/graphql";
import { watchStatus } from "src/hooks/operations/useWatchStatus";

type WatchStatusEditFormState = {
  color: string;
  status: string;
};

export const WatchStatusEntry = ({
  data,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCancel = () => {},
}: {
  data?: Pick<WatchStatus, "id" | "status" | "color">;
  onSubmit?: (data: Pick<WatchStatus, "id" | "status" | "color">) => void;
  onCancel?: () => void;
}) => {
  const [editMode, setEditMode] = useState<boolean>(data ? false : true);
  const { mutate: create } = watchStatus.useCreate();
  const { mutate: update } = watchStatus.useUpdate();
  const { mutate: remove } = watchStatus.useDelete();
  const methods = useForm<WatchStatusEditFormState>({ reValidateMode: "onChange" });
  const { handleSubmit } = methods;

  const onSubmitCallback = useCallback(
    () =>
      handleSubmit(({ status, color }) => {
        if (data?.id) {
          update({ id: data.id, input: { status, color } });
        } else {
          create(
            { input: { status, color } },
            { onSuccess: ({ createWatchStatus: data }) => onSubmit(data) },
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
            name="color"
            defaultValue={data?.color ?? tinycolor.random().toHexString().toUpperCase()}
            render={({ field }) => <ColorPicker {...field} isDisabled={!editMode} />}
          />
          <Controller
            name="status"
            defaultValue={data?.status || undefined}
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
