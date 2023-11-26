import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
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
  Spacer,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { AccordionIcon } from "src/components/AccordionIcon";
import { AlternativeTitlesField } from "src/components/AlternativeTitlesField";
import { Season } from "src/generated/graphql";
import { integration } from "src/hooks/operations/useIntegration";
import { series } from "src/hooks/operations/useSeries";
import {
  RELATIONSHIPS,
  RelationshipTypes,
  renderSeriesRelations,
} from "src/utilities/series-relations.utilities";
import { numberSchemaBuilder } from "src/utilities/validation.utilities";
import isURL from "validator/es/lib/isURL";

import { useIntegrationModal } from "./components/IntegrationModal";
import { ReferencesInput } from "./components/ReferencesInput";
import { ReleaseDateInput } from "./components/ReleaseDateInput";
import { SeriesRelationshipsInput } from "./components/SeriesRelationshipsInput";
import { TypeInput } from "./components/TypeInput";

const schema = z
  .object({
    title: z.string().trim().nonempty("Title is required."),
    alternativeTitles: z
      .object({ title: z.string().trim().nonempty("Title cannot be empty.") })
      .array(),
    type: z.string().nonempty("Type is required."),
    release: z.object({
      season: z.nativeEnum(Season).or(z.literal("")),
      year: numberSchemaBuilder("Year", { constraint: "non-negative" }).refine(
        (val) => isNaN(val) || val < 9999,
        "Invalid year.",
      ),
    }),
    references: z
      .object({
        id: z.string().nullable(),
        source: z.string().trim().nonempty("Source is required."),
        link: z
          .string()
          .trim()
          .nonempty("Link is required.")
          .refine(
            (val) => isURL(val, { allow_fragments: false, allow_query_components: false }),
            "Invalid link.",
          ),
      })
      .array(),
    remarks: z.string().trim(),
  })
  .extend(
    RELATIONSHIPS.reduce(
      (existing, key) => ({ ...existing, [key]: z.string().array() }),
      {} as { [K in RelationshipTypes]: z.ZodArray<z.ZodString> },
    ),
  )
  .superRefine((data, ctx) => {
    const map = new Map<string, RelationshipTypes[]>();
    for (const key of RELATIONSHIPS) {
      const values = data[key];
      for (const value of values) {
        const existing = map.get(value);
        if (existing) {
          existing.push(key);
        } else {
          map.set(value, [key]);
        }
      }
    }
    const invalids = new Set<RelationshipTypes>();
    for (const values of map.values()) {
      if (values.length <= 1) {
        continue;
      }
      values.forEach((value) => invalids.add(value));
    }
    for (const invalid of invalids) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [invalid],
        message: `${renderSeriesRelations(invalid)} contains animes used in other relationships.`,
      });
    }
  });

export type CreateUpdateSeriesFormState = z.infer<typeof schema>;

export const CreateUpdateSeriesForm = ({ seriesId }: { seriesId?: string }) => {
  const navigate = useNavigate();
  const toast = useToast({ position: "top", status: "success" });
  const { onOpen } = useIntegrationModal();
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const [showReferences, setShowReferences] = useState<boolean>(false);

  const { mutate: create } = series.useCreate();
  const { mutate: update } = series.useUpdate();

  const { data: { series: data } = {} } = series.useGetEditable({ id: seriesId ?? "" });
  const { data: { integrations } = {} } = integration.useGet();

  const methods = useForm<CreateUpdateSeriesFormState>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      alternativeTitles: [],
      type: "",
      release: {
        season: "",
        year: NaN,
      },
      references: [],
      prequels: [],
      sequels: [],
      mainStories: [],
      sideStories: [],
      relatedSeries: [],
      remarks: "",
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (seriesId && data) {
      setValue("title", data.title);
      setValue(
        "alternativeTitles",
        data.alternativeTitles.map((t) => ({ title: t })),
      );
      setValue("type", data.type.id);
      setValue("release.season", data.releaseSeason ?? "");
      setValue("release.year", data.releaseYear ?? NaN);
      setValue("references", data.references);
      RELATIONSHIPS.map((relation) =>
        setValue(
          relation,
          data[relation].map((s) => s.id),
        ),
      );
      setValue("remarks", data.remarks ?? "");
      setShowAlternativeTitles(data.alternativeTitles.length > 0);
      setShowReferences(data.references.length > 0);
    }
  }, [seriesId, data, setValue]);

  const { append: appendReferences } = useFieldArray({ control, name: "references" });
  const { append: appendAlternativeTitles } = useFieldArray({ control, name: "alternativeTitles" });

  const onSubmit = (data: CreateUpdateSeriesFormState) => {
    const alternativeTitles = data.alternativeTitles.map((value) => value.title);
    const releaseYear = !isNaN(data.release.year) ? data.release.year : null;
    const releaseSeason = data.release.season || null;
    const remarks = data.remarks || null;
    const input = {
      ...data,
      alternativeTitles,
      remarks,
      release: { season: releaseSeason, year: releaseYear },
    };
    if (seriesId) {
      update(
        { id: seriesId, input },
        {
          onSuccess: (data) => {
            toast({ description: "Successfully updated anime" });
            navigate(`/series/${data.updateSeries.id}`);
          },
        },
      );
      return;
    }
    create(
      { input },
      {
        onSuccess: (data) => {
          toast({ description: "Successfully created anime" });
          navigate(`/series/${data.createSeries.id}`);
        },
      },
    );
  };

  const onReset = useCallback(() => {
    if (data) {
      reset({
        title: data.title,
        alternativeTitles: data.alternativeTitles.map((t) => ({ title: t })),
        type: data.type.id,
        release: {
          season: data.releaseSeason ?? "",
          year: data.releaseYear ?? NaN,
        },
        references: data.references,
        remarks: data.remarks ?? "",
        ...RELATIONSHIPS.reduce(
          (current, key) => ({
            ...current,
            [key]: data[key].map((s) => s.id),
          }),
          {},
        ),
      });
    } else {
      reset({ alternativeTitles: [], references: [] });
    }
  }, [reset, data]);

  if (seriesId && !data) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* <IntegrationModal isOpen={isOpen} onClose={onClose} /> */}
        <Stack spacing={6}>
          <Stack spacing={4}>
            <Controller
              name="title"
              render={({ field, fieldState: { error } }) => (
                <FormControl isRequired isInvalid={!!error}>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input id="title" {...field} />
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
          </Stack>
          <TypeInput />
          <ReleaseDateInput />
          {showReferences ? (
            <Stack spacing={0}>
              <Text mb={2} w="full" textAlign="left" fontSize="md" fontWeight="medium">
                References
              </Text>
              <Card variant="outline" size="sm">
                <CardBody>
                  <ReferencesInput />
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
              {({ isExpanded }) => (
                <>
                  <AccordionButton px={2}>
                    <Text w="full" textAlign="left" fontSize="md" fontWeight="medium">
                      Related Animes
                    </Text>
                    <AccordionIcon isExpanded={isExpanded} />
                  </AccordionButton>
                  <AccordionPanel px={2} py={4}>
                    <SeriesRelationshipsInput />
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
          <Controller
            name="remarks"
            render={({ field, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <FormLabel htmlFor="remarks">Remarks</FormLabel>
                <Textarea id="remarks" {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <HStack spacing={4}>
            <Button w="fit-content" type="submit" isLoading={isSubmitting}>
              {seriesId ? "Save" : "Create"}
            </Button>
            <Button w="fit-content" variant="outline" colorScheme="gray" onClick={onReset}>
              Reset
            </Button>
            <Spacer />
            {!seriesId && !!integrations?.length && (
              <Button w="fit-content" variant="outline" colorScheme="blue" onClick={onOpen}>
                Auto Populate
              </Button>
            )}
          </HStack>
        </Stack>
      </form>
    </FormProvider>
  );
};
