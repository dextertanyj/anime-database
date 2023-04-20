import { useMemo } from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { MenuSelect } from "src/components/MenuSelect";
import { fileSource } from "src/hooks/operations/useFileSource";

export const SourceInput = () => {
  const { data } = fileSource.useGetAll();

  const sourceOptions = useMemo(
    () => data?.fileSources.map((source) => ({ value: source.id, label: source.source })),
    [data],
  );

  if (!sourceOptions) {
    return null;
  }

  return (
    <Controller
      name="source"
      render={({ field, fieldState: { error } }) => (
        <FormControl isRequired isInvalid={!!error}>
          <FormLabel htmlFor="source">Source</FormLabel>
          <MenuSelect id="source" w="full" maxW="250px" options={sourceOptions} {...field} />
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
};
