import { useMemo } from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { CreatableSelect } from "chakra-react-select";
import { Controller } from "react-hook-form";

import { file } from "src/hooks/operations/useFile";

export const CodecInput = () => {
  const { data } = file.useGetAllCodecs();

  const codecOptions = useMemo(
    () => data?.fileCodecs.map((value) => ({ label: value, value })),
    [data],
  );

  return (
    <Controller
      name={"codec"}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
        <FormControl maxW="250px" isRequired isInvalid={!!error}>
          <FormLabel htmlFor="codec">Codec</FormLabel>
          <CreatableSelect
            id="codec"
            useBasicStyles
            options={codecOptions}
            placeholder=""
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value={value && { label: value, value }}
            onChange={(value: { label: string; value: string } | null) => {
              onChange(value?.value || null);
            }}
            {...field}
          />
          <FormErrorMessage>{error && error.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
};
