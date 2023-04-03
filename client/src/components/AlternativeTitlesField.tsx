import { useCallback } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  IconButton,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Controller, useFieldArray } from "react-hook-form";

import { BiTrash } from "react-icons/bi";

export const AlternativeTitlesField = () => {
  const { fields, append, remove } = useFieldArray<{ alternativeTitles: { title: string }[] }>({
    name: "alternativeTitles",
  });

  const addField = useCallback(() => {
    append({ title: "" });
  }, [append]);

  return (
    <Stack spacing={4}>
      {fields.map((item, index) => (
        <Controller
          key={item.id}
          name={`alternativeTitles.${index}.title`}
          render={({ field, fieldState: { error } }) => (
            <HStack alignItems="top">
              <FormControl isRequired isInvalid={!!error}>
                <Input {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
              <IconButton aria-label="remove" icon={<BiTrash />} onClick={() => remove(index)} />
            </HStack>
          )}
        />
      ))}
      <Button variant="outline" onClick={addField}>
        Add
      </Button>
    </Stack>
  );
};
