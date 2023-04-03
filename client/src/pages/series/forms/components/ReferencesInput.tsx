import { useCallback, useMemo } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { chakraComponents, CreatableSelect } from "chakra-react-select";
import { Controller, useFieldArray } from "react-hook-form";

import { BiChevronDown, BiTrash } from "react-icons/bi";
import { series } from "src/hooks/operations/useSeries";

import type { CreateUpdateSeriesFormState } from "../CreateUpdateSeriesForm";

export const ReferencesInput = () => {
  const { data: { referenceSources: sources } = {} } = series.useGetAllSources();

  const { fields, append, remove } = useFieldArray<CreateUpdateSeriesFormState>({
    name: "references",
  });

  const addField = useCallback(() => {
    append({ id: null, source: "", link: "" });
  }, [append]);

  const sourceOptions = useMemo(
    () => sources?.map((value) => ({ label: value, value })),
    [sources],
  );

  if (!sources) {
    return null;
  }

  return (
    <Stack spacing={4}>
      {fields.length && (
        <HStack pr="48px" spacing={4} mb={-2}>
          <Text w="full" maxW="300px" textAlign="left" fontSize="md" fontWeight="medium">
            Source
          </Text>
          <Text w="full" textAlign="left" fontSize="md" fontWeight="medium">
            Link
          </Text>
        </HStack>
      )}
      {fields.map((item, index) => (
        <HStack key={item.id} spacing={4} alignItems="top">
          <Controller
            name={`references.${index}.source`}
            defaultValue={null}
            render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
              <FormControl maxW="300px" isInvalid={!!error}>
                <CreatableSelect
                  options={sourceOptions}
                  placeholder=""
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  value={value && { label: value, value }}
                  onChange={(value: { label: string; value: string } | null) => {
                    onChange(value?.value || null);
                  }}
                  components={{
                    DropdownIndicator: (props) => (
                      <chakraComponents.DropdownIndicator {...props}>
                        <Icon as={BiChevronDown} boxSize={4} />
                      </chakraComponents.DropdownIndicator>
                    ),
                  }}
                  {...field}
                />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name={`references.${index}.link`}
            defaultValue={""}
            render={({ field, fieldState: { error } }) => (
              <FormControl w="full" isInvalid={!!error}>
                <Input {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <IconButton aria-label="remove" icon={<BiTrash />} onClick={() => remove(index)} />
        </HStack>
      ))}
      <Button variant="outline" onClick={addField}>
        Add
      </Button>
    </Stack>
  );
};
