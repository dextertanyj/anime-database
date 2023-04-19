import { FormControl, FormErrorMessage, FormLabel, HStack, Text } from "@chakra-ui/react";
import { useController, useFormContext } from "react-hook-form";

import { InputBox } from "src/components/InputBox";
import { NumericInput } from "src/components/NumericInput";

import { CreateUpdateFileFormState } from "../CreateUpdateFileForm";

export const ResolutionInput = () => {
  const {
    formState: { errors },
  } = useFormContext<CreateUpdateFileFormState>();
  const { field: heightField } = useController<CreateUpdateFileFormState>({
    name: "resolution.height",
  });
  const { field: widthField } = useController<CreateUpdateFileFormState>({
    name: "resolution.width",
  });

  return (
    <FormControl maxW="250px" w="full" isRequired isInvalid={!!errors.resolution}>
      <FormLabel htmlFor="resolution">Resolution</FormLabel>
      <InputBox>
        <HStack h="full" spacing={2}>
          <NumericInput
            id="resolution"
            h="full"
            borderRadius={0}
            variant="unstyled"
            {...heightField}
            value={heightField.value as number}
          />
          <Text>{"\u00D7"}</Text>
          <NumericInput
            h="full"
            borderRadius={0}
            variant="unstyled"
            {...widthField}
            value={widthField.value as number}
          />
        </HStack>
      </InputBox>
      <FormErrorMessage>
        {errors.resolution?.message ||
          errors.resolution?.height?.message ||
          errors.resolution?.width?.message}
      </FormErrorMessage>
    </FormControl>
  );
};
