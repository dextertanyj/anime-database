import { useMemo } from "react";
import { FormControl, FormErrorMessage, FormLabel, Icon, Stack } from "@chakra-ui/react";
import { chakraComponents, Select } from "chakra-react-select";
import { Controller } from "react-hook-form";

import { BiChevronDown } from "react-icons/bi";
import { series } from "src/hooks/operations/useSeries";
import {
  RELATIONSHIPS,
  seriesRelationsToDisplayString,
} from "src/utilities/series-relations.utilities";

export const SeriesRelationshipsInput = () => {
  const { data: { serieses } = {} } = series.useGetAll();

  const seriesOptions = useMemo(
    () => serieses?.map((series) => ({ value: series.id, label: series.title })),
    [serieses],
  );

  if (!seriesOptions) {
    return null;
  }

  return (
    <Stack spacing={4}>
      {RELATIONSHIPS.map((relation) => (
        <Controller
          key={relation}
          name={relation}
          render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor={relation}>{seriesRelationsToDisplayString(relation)}</FormLabel>
              <Select
                id={relation}
                isMulti={true}
                isSearchable={true}
                options={seriesOptions}
                placeholder=""
                chakraStyles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: 56,
                  }),
                }}
                components={{
                  DropdownIndicator: (props) => (
                    <chakraComponents.DropdownIndicator {...props}>
                      <Icon as={BiChevronDown} boxSize={4} />
                    </chakraComponents.DropdownIndicator>
                  ),
                }}
                value={seriesOptions.filter((series) => (value as string[]).includes(series.value))}
                onChange={(value: readonly { label: string; value: string }[]) =>
                  onChange(value.map((v) => v.value))
                }
                {...field}
              />
              <FormErrorMessage>{error && error.message}</FormErrorMessage>
            </FormControl>
          )}
        />
      ))}
    </Stack>
  );
};
