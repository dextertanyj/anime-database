import { ReactNode, useCallback, useMemo, useState } from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { MutateOptions } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { DeepPartial, FieldValues, FormProvider, useForm } from "react-hook-form";

import { BiEdit, BiSave, BiTrash, BiXCircle } from "react-icons/bi";

export const EditableListEntry = <
  TData extends { id?: string },
  TFormState extends FieldValues & Omit<TData, "id">,
  TCreateResponse,
>({
  data,
  defaultFormValues,
  children,
  useCreate,
  useUpdate,
  useDelete,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSubmit = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCancel = () => {},
}: {
  data?: TData;
  defaultFormValues: DeepPartial<TFormState>;
  children: ReactNode | ((props: { editMode: boolean }) => ReactNode);
  onSubmit?: (data: TCreateResponse) => void;
  onCancel?: () => void;
  useCreate: () => {
    mutate: (
      variables: { input: TFormState },
      options?: MutateOptions<TCreateResponse, ClientError, { input: TFormState }>,
    ) => void;
  };
  useUpdate: () => {
    mutate: (
      variables: { id: string; input: TFormState },
      options?: MutateOptions<
        unknown,
        ClientError,
        { id: string; input: { [K in keyof TFormState]?: TFormState[K] | undefined | null } }
      >,
    ) => void;
  };
  useDelete: () => {
    mutate: (
      variables: { id: string },
      options?: MutateOptions<unknown, ClientError, { id: string }>,
    ) => void;
  };
}) => {
  const [editMode, setEditMode] = useState<boolean>(data ? false : true);
  const methods = useForm<TFormState>({
    reValidateMode: "onChange",
    defaultValues: defaultFormValues,
  });
  const { handleSubmit } = methods;
  const { mutate: create } = useCreate();
  const { mutate: update } = useUpdate();
  const { mutate: remove } = useDelete();

  const onSubmitCallback = useCallback(
    () =>
      handleSubmit((input: TFormState) => {
        if (data?.id) {
          update({ id: data.id, input });
        } else {
          create({ input }, { onSuccess: (data) => onSubmit(data) });
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
    onCancel();
  }, [data?.id, onCancel, remove]);

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
          {typeof children === "function" ? children({ editMode }) : children}
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
