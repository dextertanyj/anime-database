import { Box, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { MenuSelect } from "src/components/MenuSelect";
import { Season } from "src/generated/graphql";

import { CreateUpdateSeriesFormState } from "../CreateUpdateSeriesForm";

export const ReleaseDateInput = () => {
  const {
    formState: { errors },
  } = useFormContext<CreateUpdateSeriesFormState>();
  const { field: seasonField } = useController<CreateUpdateSeriesFormState>({
    name: "release.season",
  });
  const { field: yearField } = useController<CreateUpdateSeriesFormState>({
    name: "release.year",
  });

  return (
    <FormControl
      w="full"
      maxW="500px"
      isInvalid={!!(errors.release?.year || errors.release?.season)}
    >
      <FormLabel>Release Season & Year</FormLabel>
      <Box display="flex">
        <MenuSelect
          w="full"
          maxW="250px"
          borderRightRadius={0}
          options={[{ id: "", value: "\u00A0" }].concat(
            Object.entries(Season).map((entry) => ({
              id: entry[1],
              value: entry[0],
            })),
          )}
          isInvalid={!!errors.release?.season}
          {...seasonField}
          value={seasonField.value as Season | ""}
        />

        <Input
          w="full"
          maxW="150px"
          type="number"
          borderLeftRadius={0}
          sx={{ marginLeft: "-1px" }}
          {...yearField}
          value={isNaN(yearField.value as number) ? "" : (yearField.value as number).toString()}
        />
      </Box>
      <FormErrorMessage>
        {errors.release?.year?.message || errors.release?.season?.message}
      </FormErrorMessage>
    </FormControl>
  );
};
