import { useMemo } from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

import { MenuSelect } from "src/components/MenuSelect";
import { seriesType } from "src/hooks/operations/useSeriesType";

export const TypeInput = () => {
  const { data: seriesTypes } = seriesType.useGetAll();

  const typeOptions = useMemo(
    () => seriesTypes?.seriesTypes.map((type) => ({ id: type.id, value: type.type })),
    [seriesTypes],
  );

  if (!typeOptions) {
    return null;
  }

  return (
    <Controller
      name="type"
      render={({ field, fieldState: { error } }) => (
        <FormControl isRequired isInvalid={!!error}>
          <FormLabel htmlFor="type">Type</FormLabel>
          <MenuSelect id="type" w="full" maxW="250px" options={typeOptions} {...field} />
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
};
