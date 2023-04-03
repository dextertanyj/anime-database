import { useCallback, useEffect, useMemo, useState } from "react";
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
import { MenuSelect } from "src/components/MenuSelect";
import { Season } from "src/generated/graphql";
import { series } from "src/hooks/operations/useSeries";
import { seriesType } from "src/hooks/operations/useSeriesType";
import {
  RELATIONSHIPS,
  RelationshipTypes,
  seriesRelationsToDisplayString,
} from "src/utilities/series-relations.utilities";
import isURL from "validator/es/lib/isURL";

import { ReferencesInput } from "./components/ReferencesInput";
import { ReleaseDateInput } from "./components/ReleaseDateInput";
import { SeriesRelationshipsInput } from "./components/SeriesRelationshipsInput";

export type CreateUpdateSeriesFormProps = {
  seriesId?: string;
};

const schema = z
  .object({
    title: z.string().trim().min(1, { message: "Title is required." }),
    alternativeTitles: z
      .object({ title: z.string().trim().min(1, { message: "Title cannot be empty." }) })
      .array(),
    type: z.string().min(1, { message: "Type is required." }),
    release: z.object({
      season: z.nativeEnum(Season).or(z.literal("")),
      year: z
        .union([
          z.number().int(),
          z.nan(),
          z
            .string()
            .refine((val) => /^\d*$/.test(val), "Year must be a number.")
            .transform((val) => (val === "" ? NaN : parseInt(val))),
        ])
        .refine((val) => isNaN(val) || (0 < val && val < 9999), "Year must be a valid year."),
    }),
    references: z
      .object({
        id: z.string().nullable(),
        source: z.string().trim().min(1, { message: "Source is required." }),
        link: z
          .string()
          .trim()
          .min(1, { message: "Link is required." })
          .refine(
            (val) => isURL(val, { allow_fragments: false, allow_query_components: false }),
            "Link must be a valid URL.",
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
        message: `${seriesRelationsToDisplayString(
          invalid,
        )} contains animes used in other relationships.`,
      });
    }
  });

export type CreateUpdateSeriesFormState = z.infer<typeof schema>;

export const CreateUpdateSeriesForm = ({ seriesId }: CreateUpdateSeriesFormProps) => {
  const { data: existing } = series.useGetEditable({ id: seriesId ?? "" });
  const navigate = useNavigate();
  const toast = useToast({ position: "top", status: "success" });

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
    reset,
  } = methods;

  useEffect(() => {
    if (seriesId && existing?.series) {
      setValue("title", existing.series.title);
      setValue(
        "alternativeTitles",
        existing.series.alternativeTitles.map((t) => ({ title: t })),
      );
      setValue("type", existing.series.type.type);
      setValue("release.season", existing.series.releaseSeason ?? "");
      setValue("release.year", existing.series.releaseYear ?? NaN);
      setValue("references", existing.series.references);
      RELATIONSHIPS.map((relation) =>
        setValue(relation, existing.series?.[relation]?.map((s) => s.id) ?? []),
      );
      setValue("remarks", existing.series.remarks ?? "");
      setShowAlternativeTitles(existing.series.alternativeTitles.length > 0);
      setShowReferences(existing.series.references.length > 0);
    }
  }, [seriesId, existing, setValue]);

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
    if (existing?.series) {
      reset({
        title: existing.series.title,
        alternativeTitles: existing.series.alternativeTitles.map((t) => ({ title: t })),
        type: existing.series.type.type,
        release: {
          season: existing.series.releaseSeason ?? "",
          year: existing.series.releaseYear ?? NaN,
        },
        references: existing.series.references,
        remarks: existing.series.remarks ?? "",
        ...RELATIONSHIPS.reduce(
          (current, key) => ({
            ...current,
            [key]: existing?.series?.[key].map((s) => s.id) ?? [],
          }),
          {},
        ),
      });
    } else {
      reset({ alternativeTitles: [], references: [] });
    }
  }, [reset, existing]);

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
        <Stack spacing={6}>
          <Stack spacing={4}>
            <Controller
              name="title"
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
          </Stack>
          <Controller
            name="type"
            render={({ field, fieldState: { error } }) => (
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel htmlFor="type">Type</FormLabel>
                <MenuSelect w="full" maxW="250px" options={typeOptions} {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
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
                <Textarea {...field} />
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
          </HStack>
        </Stack>
      </form>
    </FormProvider>
  );
};