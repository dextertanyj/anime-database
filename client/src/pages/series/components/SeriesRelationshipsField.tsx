import { useMemo } from "react";
import { FormControl, FormErrorMessage, FormLabel, Stack } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Controller } from "react-hook-form";

import { series } from "src/hooks/operations/useSeries";
import {
  RELATIONSHIPS,
  seriesRelationsToDisplayString,
} from "src/utilities/series-relations.utilities";

export const SeriesRelationshipsField = () => {
  const { data: serieses } = series.useGetAll();

  const seriesOptions = useMemo(
    () => serieses?.serieses.map((series) => ({ value: series.id, label: series.title })),
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
          defaultValue={[]}
          render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor={relation}>{seriesRelationsToDisplayString(relation)}</FormLabel>
              <Select
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
