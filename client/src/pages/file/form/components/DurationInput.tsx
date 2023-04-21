import { FormControl, FormErrorMessage, FormLabel, HStack, Text } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { InputBox } from "src/components/InputBox";
import { NumericInput } from "src/components/NumericInput";

import { CreateUpdateFileFormState } from "../CreateUpdateFileForm";

export const DurationInput = () => {
  const {
    formState: { errors },
  } = useFormContext<CreateUpdateFileFormState>();
  const { field: hoursField } = useController<CreateUpdateFileFormState>({
    name: "duration.hours",
  });
  const { field: minutesField } = useController<CreateUpdateFileFormState>({
    name: "duration.minutes",
  });
  const { field: secondsField } = useController<CreateUpdateFileFormState>({
    name: "duration.seconds",
  });

  return (
    <FormControl w="full" isRequired isInvalid={!!errors.duration}>
      <FormLabel htmlFor="duration">Duration</FormLabel>
      <InputBox>
        <HStack h="full" maxW="100px" spacing={2}>
          <NumericInput
            id="duration"
            h="full"
            maxLength={2}
            borderRadius={0}
            variant="unstyled"
            {...hoursField}
            value={hoursField.value as number}
          />
          <Text>:</Text>
          <NumericInput
            h="full"
            maxLength={2}
            borderRadius={0}
            variant="unstyled"
            {...minutesField}
            value={minutesField.value as number}
          />
          <Text>:</Text>
          <NumericInput
            h="full"
            maxLength={2}
            borderRadius={0}
            variant="unstyled"
            {...secondsField}
            value={secondsField.value as number}
          />
        </HStack>
      </InputBox>
      <FormErrorMessage>
        {errors.duration?.message ||
          errors.duration?.hours?.message ||
          errors.duration?.minutes?.message ||
          errors.duration?.seconds?.message}
      </FormErrorMessage>
    </FormControl>
  );
};
