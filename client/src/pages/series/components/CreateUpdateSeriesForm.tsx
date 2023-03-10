import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";

import { MenuSelect } from "src/components/MenuSelect";
import { Season } from "src/generated/graphql";
import { series } from "src/hooks/operations/useSeries";
import { seriesType } from "src/hooks/operations/useSeriesType";
import { RELATIONSHIPS, RelationshipTypes } from "src/utilities/series-relations.utilities";

import { AlternativeTitlesField } from "./AlternativeTitlesField";
import { ReferencesField } from "./ReferencesField";
import { SeriesRelationshipsField } from "./SeriesRelationshipsField";

export type CreateUpdateSeriesFormProps = {
  seriesId?: string;
};

export type CreateUpdateSeriesFormState = {
  title: string;
  alternativeTitles: { title: string }[];
  type: string;
  remarks: string;
  release: { season: Season | ""; year: string };
  references: { id: string | null; link: string; source: string }[];
} & Record<RelationshipTypes, string[]>;

export const CreateUpdateSeriesForm = ({ seriesId }: CreateUpdateSeriesFormProps) => {
  const { data: existing } = series.useGet({ id: seriesId ?? "" });

  const methods = useForm<CreateUpdateSeriesFormState>();
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const [showReferences, setShowReferences] = useState<boolean>(false);

  const { data: seriesTypes } = seriesType.useGetAll();
  const { mutate: create } = series.useCreate();
  const { mutate: update } = series.useUpdate();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (seriesId && existing?.series) {
      setValue("title", existing.series.title);
      setValue(
        "alternativeTitles",
        existing.series.alternativeTitles.map((t) => ({ title: t })),
      );
      setValue("type", existing.series.type.type);
      setValue("remarks", existing.series.remarks ?? "");
      setValue("release.season", existing.series.releaseSeason ?? "");
      setValue("release.year", existing.series.releaseYear?.toString(10) ?? "");
      setValue("references", existing.series.references);
      RELATIONSHIPS.map((relation) =>
        setValue(relation, existing.series?.[relation]?.map((s) => s.id) ?? []),
      );
      setShowAlternativeTitles(existing.series.alternativeTitles.length > 0);
      setShowReferences(existing.series.references.length > 0);
    }
  }, [seriesId, existing, setValue]);

  const { append: appendReferences } = useFieldArray({ control, name: "references" });
  const { append: appendAlternativeTitles } = useFieldArray({ control, name: "alternativeTitles" });

  const onSubmit = (data: CreateUpdateSeriesFormState) => {
    const alternativeTitles = data.alternativeTitles.map((value) => value.title);
    const releaseYear = data.release.year ? Number(data.release.year) : null;
    const releaseSeason = data.release.season || null;
    const remarks = data.remarks || null;
    const input = {
      ...data,
      alternativeTitles,
      remarks,
      release: { season: releaseSeason, year: releaseYear },
    };
    if (seriesId) {
      update({ id: seriesId, input });
      return;
    }
    create({ input });
  };

  const typeOptions = useMemo(
    () => seriesTypes?.seriesTypes.map((type) => ({ id: type.id, value: type.type })),
    [seriesTypes],
  );

  if (!typeOptions) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="6">
          <Stack spacing={5}>
            <Controller
              name="title"
              defaultValue={""}
              rules={{ required: "Title is required." }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isRequired isInvalid={!!error}>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input {...field} />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            {showAlternativeTitles ? (
              <Stack spacing={0}>
                <Text mb={2} w="full" textAlign="left" fontSize="md" fontWeight="medium">
                  Alternative Titles
                </Text>
                <Card variant="outline" size="sm">
                  <CardBody>
                    <AlternativeTitlesField />
                  </CardBody>
                </Card>
              </Stack>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setShowAlternativeTitles(true);
                  appendAlternativeTitles({ title: "" });
                }}
                w="fit-content"
              >
                Add Titles
              </Button>
            )}
            <Controller
              name="type"
              defaultValue={""}
              rules={{ required: "Series type is required." }}
              render={({ field, fieldState: { error } }) => (
                <FormControl isRequired isInvalid={!!error}>
                  <FormLabel htmlFor="type">Type</FormLabel>
                  <MenuSelect
                    w="full"
                    maxW="250px"
                    options={typeOptions}
                    setValue={(v) => setValue("type", v)}
                    {...field}
                  />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Stack w="full" maxW="500px" spacing={0}>
              <Text mb={2} w="full" textAlign="left" fontSize="md" fontWeight="medium">
                Release Season & Year
              </Text>
              <HStack spacing={0}>
                <Controller
                  name="release.season"
                  defaultValue={""}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl w="full" maxW="150px" isInvalid={!!error}>
                      <MenuSelect
                        w="full"
                        borderRightRadius={0}
                        options={Object.entries(Season).map((entry) => ({
                          id: entry[1],
                          value: entry[0],
                        }))}
                        {...field}
                      />
                      <FormErrorMessage>{error && error.message}</FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  name="release.year"
                  defaultValue={""}
                  rules={{
                    pattern: {
                      value: /^\d{4}$/i,
                      message: "Invalid year.",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl w="full" maxW="100px" isInvalid={!!error}>
                      <NumberInput value={field.value as string} min={0}>
                        <NumberInputField {...field} borderLeftRadius={0} borderLeftWidth={0} />
                      </NumberInput>
                      <FormErrorMessage>{error && error.message}</FormErrorMessage>
                    </FormControl>
                  )}
                />
              </HStack>
            </Stack>
            {showReferences ? (
              <Stack spacing={0}>
                <Text mb={2} w="full" textAlign="left" fontSize="md" fontWeight="medium">
                  References
                </Text>
                <Card variant="outline" size="sm">
                  <CardBody>
                    <ReferencesField />
                  </CardBody>
                </Card>
              </Stack>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setShowReferences(true);
                  appendReferences({ id: null, link: "", source: "" });
                }}
                w="fit-content"
              >
                Add References
              </Button>
            )}
            <Accordion
              allowToggle={true}
              sx={{
                ".chakra-collapse": { overflow: "visible !important" },
              }}
            >
              <AccordionItem>
                <AccordionButton px={2}>
                  <Text w="full" textAlign="left" fontSize="md" fontWeight="medium">
                    Related Animes
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={2} py={4}>
                  <SeriesRelationshipsField />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Stack>
          <Controller
            name="remarks"
            defaultValue={""}
            render={({ field, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="remarks">Remarks</FormLabel>
                <Textarea {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Button w="fit-content" type="submit" isLoading={isSubmitting}>
            {seriesId ? "Save" : "Create"}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};
