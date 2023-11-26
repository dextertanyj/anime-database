import { memo, useEffect, useMemo } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { MenuSelect } from "src/components/MenuSelect";
import { NumericInput } from "src/components/NumericInput";
import { configuration } from "src/hooks/operations/useConfiguration";
import { seriesType } from "src/hooks/operations/useSeriesType";
import { numberSchemaBuilder } from "src/utilities/validation.utilities";

import { CONFIGURATION_KEYS } from "~shared/configuration-keys";

const KEYS = CONFIGURATION_KEYS.INTEGRATION.ANIDB;

const schema = z.object({
  client: z.object({
    name: z.string().nonempty("Client name is required."),
    version: numberSchemaBuilder("Client version", {
      required: true,
      constraint: "positive",
    }),
  }),
  type: z.object({
    tvSeries: z.string().optional(),
    tvSpecial: z.string().optional(),
    movie: z.string().optional(),
    musicVideo: z.string().optional(),
    web: z.string().optional(),
    other: z.string().optional(),
  }),
});

type AniDBIntegrationFormState = z.infer<typeof schema>;

export const AniDBIntegrationForm = () => {
  const toast = useToast({ position: "top" });

  const { data: seriesTypes } = seriesType.useGetAll();

  const options = useMemo(
    () => seriesTypes?.seriesTypes.map((type) => ({ value: type.id, label: type.type })) ?? [],
    [seriesTypes],
  );

  const { mutate } = configuration.useSetMultiple({
    keys: [KEYS.CLIENT.NAME, KEYS.CLIENT.VERSION],
  });

  const { data: { configurations } = {} } = configuration.useGetAll();

  const methods = useForm<AniDBIntegrationFormState>({
    resolver: zodResolver(schema),
    defaultValues: {
      client: { name: "", version: NaN },
      type: {
        tvSeries: "",
      },
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (configurations) {
      setValue(
        "client.name",
        configurations.find((entry) => entry.key === KEYS.CLIENT.NAME)?.value ?? "",
      );
      setValue(
        "client.version",
        parseInt(configurations.find((entry) => entry.key === KEYS.CLIENT.VERSION)?.value ?? ""),
      );
      setValue(
        "type.tvSeries",
        configurations.find((entry) => entry.key === KEYS.TYPE.TV_SERIES)?.value ?? "",
      );
      setValue(
        "type.tvSpecial",
        configurations.find((entry) => entry.key === KEYS.TYPE.TV_SPECIAL)?.value ?? "",
      );
      setValue(
        "type.movie",
        configurations.find((entry) => entry.key === KEYS.TYPE.MOVIE)?.value ?? "",
      );
      setValue(
        "type.musicVideo",
        configurations.find((entry) => entry.key === KEYS.TYPE.MUSIC_VIDEO)?.value ?? "",
      );
      setValue(
        "type.web",
        configurations.find((entry) => entry.key === KEYS.TYPE.WEB)?.value ?? "",
      );
      setValue(
        "type.other",
        configurations.find((entry) => entry.key === KEYS.TYPE.OTHER)?.value ?? "",
      );
    }
  }, [configurations, setValue]);

  const onSubmit = (data: AniDBIntegrationFormState) => {
    mutate(
      {
        input: [
          { key: KEYS.CLIENT.NAME, value: data.client.name },
          { key: KEYS.CLIENT.VERSION, value: data.client.version.toString() },
          { key: KEYS.TYPE.TV_SERIES, value: data.type.tvSeries },
        ],
      },
      {
        onSuccess: () => {
          toast({ description: "Successfully updated AniDB Settings" });
        },
      },
    );
  };

  if (!configuration) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <Stack spacing={5}>
            <Controller
              name="client.name"
              render={({ field, fieldState: { error } }) => (
                <FormControl w="full" maxW="400px" isRequired isInvalid={!!error}>
                  <FormLabel htmlFor="client.name">Client Name</FormLabel>
                  <Input id="client.name" {...field} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="client.version"
              render={({ field, fieldState: { error } }) => (
                <FormControl w="full" maxW="200px" isRequired isInvalid={!!error}>
                  <FormLabel htmlFor="client.version">Client Version</FormLabel>
                  <NumericInput id="client.version" {...field} value={field.value as number} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <SimpleGrid minChildWidth="250px" spacing={5}>
              <AniDBTypeSelect name="type.tvSeries" label="TV Series" options={options} />
              <AniDBTypeSelect name="type.tvSpecial" label="TV Special" options={options} />
              <AniDBTypeSelect name="type.movie" label="Movie" options={options} />
              <AniDBTypeSelect name="type.musicVideo" label="Music Video" options={options} />
              <AniDBTypeSelect name="type.web" label="Web" options={options} />
              <AniDBTypeSelect name="type.other" label="Other" options={options} />
            </SimpleGrid>
          </Stack>
          <Stack spacing="6">
            <Button w="full" maxW="200px" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};

const AniDBTypeSelect = memo(
  (props: { label: string; name: string; options: { value: string; label?: string }[] }) => {
    return (
      <Controller
        name={props.name}
        render={({ field, fieldState: { error } }) => (
          <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
            <MenuSelect id={props.name} w="full" maxW="250px" options={props.options} {...field} />
            <FormErrorMessage>{error && error.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    );
  },
);

AniDBTypeSelect.displayName = "AniDBTypeSelect";
