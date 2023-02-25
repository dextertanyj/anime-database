import { ReactElement, useCallback, useState } from "react";
import { Button, Divider, Stack } from "@chakra-ui/react";

import { BiPlus } from "react-icons/bi";

export const EditableList = <TData extends { id: string }>({
  data,
  ListElement,
}: {
  data: Array<TData>;
  ListElement: (props: {
    data?: TData;
    onSubmit?: (data: TData) => void;
    onCancel?: () => void;
  }) => ReactElement;
}) => {
  const [created, setCreated] = useState<Array<TData | undefined | string>>([]);

  const onClick = useCallback(() => {
    setCreated((val) => [...val, undefined]);
  }, []);

  const onSubmit = useCallback((idx: number, data: TData) => {
    setCreated((val) => {
      const copy = [...val];
      copy[idx] = { ...data };
      return copy;
    });
  }, []);

  const onCancel = useCallback((idx: number) => {
    setCreated((val) => {
      if (typeof val[idx] === "string") {
        return val;
      }
      const copy = [...val];
      if (!copy[idx]) {
        copy[idx] = "";
      } else {
        copy[idx] = (copy[idx] as TData).id;
      }
      return copy;
    });
  }, []);

  return (
    <Stack py={2} spacing={4} maxW="400px" divider={<Divider />}>
      {data
        .filter(
          (val) =>
            !created.find(
              (created) =>
                created &&
                (typeof created === "object" ? created.id === val.id : created === val.id),
            ),
        )
        .sort((lhs, rhs) => (lhs.id < rhs.id ? -1 : 1))
        .map((value) => (
          <ListElement key={value.id} data={value} />
        ))}
      {created.map((val, idx) =>
        typeof val !== "string" ? (
          <ListElement
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
