import { Box, FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { MenuSelect } from "src/components/MenuSelect";
import { NumericInput } from "src/components/NumericInput";
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
      <FormLabel htmlFor="release">Release Season & Year</FormLabel>
      <Box display="flex">
        <MenuSelect
          id="release"
          sx={{ borderRightRadius: 0, w: "full", maxW: "250px" }}
          options={Object.entries(Season).map((entry) => ({
            value: entry[1],
            label: entry[0],
          }))}
          {...seasonField}
          value={seasonField.value as Season | ""}
        />
        <NumericInput
          w="full"
          maxW="150px"
          borderLeftRadius={0}
          sx={{ marginLeft: "-1px" }}
          {...yearField}
          value={yearField.value as number}
        />
      </Box>
      <FormErrorMessage>
        {errors.release?.year?.message || errors.release?.season?.message}
      </FormErrorMessage>
    </FormControl>
  );
};
