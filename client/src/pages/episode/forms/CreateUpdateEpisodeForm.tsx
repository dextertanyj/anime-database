import { useCallback, useEffect, useState } from "react";
import {
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

import { AlternativeTitlesField } from "src/components/AlternativeTitlesField";
import { episode } from "src/hooks/operations/useEpisode";
import { series } from "src/hooks/operations/useSeries";

const schema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  alternativeTitles: z
    .object({ title: z.string().trim().min(1, { message: "Title cannot be empty." }) })
    .array(),
  episodeNumber: z.union([
    z.number().int(),
    z.nan(),
    z
      .string()
      .refine((val) => /^\d*$/.test(val), "Episode number must be a number.")
      .transform((val) => (val === "" ? NaN : parseInt(val))),
  ]),
  remarks: z.string(),
});

export type CreateUpdateEpisodeFormProps = {
  seriesId: string;
  episodeId?: string;
};

export type CreateUpdateEpisodeFormState = z.infer<typeof schema>;

export const CreateUpdateEpisodeForm = ({ seriesId, episodeId }: CreateUpdateEpisodeFormProps) => {
  const { data: seriesMetadata } = series.useGetMetadata({ id: seriesId });
  const { data: existing } = episode.useGetEditable({ id: episodeId ?? "" });
  const navigate = useNavigate();
  const toast = useToast({ position: "top", status: "success" });

  const methods = useForm<CreateUpdateEpisodeFormState>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      alternativeTitles: [],
      episodeNumber: NaN,
      remarks: "",
    },
  });
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);

  const { mutate: create } = episode.useCreate();
  const { mutate: update } = episode.useUpdate();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (episodeId && existing?.episode) {
      setValue("title", existing.episode.title);
      setValue(
        "alternativeTitles",
        existing.episode.alternativeTitles.map((t) => ({ title: t })),
      );
      setValue("episodeNumber", existing.episode.episodeNumber ?? NaN);
      setValue("remarks", existing.episode.remarks ?? "");
      setShowAlternativeTitles(existing.episode.alternativeTitles.length > 0);
    }
  }, [episodeId, existing, setValue]);

  const { append: appendAlternativeTitles } = useFieldArray({ control, name: "alternativeTitles" });

  const onSubmit = (data: CreateUpdateEpisodeFormState) => {
    const alternativeTitles = data.alternativeTitles.map((value) => value.title);
    const remarks = data.remarks.trim() || null;
    const episodeNumber = data.episodeNumber ? Number(data.episodeNumber) : null;
    const input = {
      ...data,
      episodeNumber,
      alternativeTitles,
      remarks,
    };
    if (episodeId) {
      update(
        { id: episodeId, input },
        {
          onSuccess: (data) => {
            toast({ description: "Successfully updated anime" });
            navigate(`/series/${seriesId}/episode/${data.updateEpisode.id}`);
          },
        },
      );
      return;
    }
    create(
      { input: { ...input, series: seriesId } },
      {
        onSuccess: (data) => {
          toast({ description: "Successfully created anime" });
          navigate(`/series/${seriesId}/episode/${data.createEpisode.id}`);
        },
      },
    );
  };

  const onReset = useCallback(() => {
    if (existing?.episode) {
      reset({
        title: existing.episode.title,
        alternativeTitles: existing.episode.alternativeTitles.map((t) => ({ title: t })),
        episodeNumber: existing.episode.episodeNumber ?? NaN,
        remarks: existing.episode.remarks ?? "",
      });
    } else {
      reset({ alternativeTitles: [] });
    }
  }, [reset, existing]);

  if (!seriesMetadata?.series) {
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
          {seriesMetadata.series.type.singular || (
            <Controller
              name="episodeNumber"
              render={({ field, fieldState: { error } }) => (
                <FormControl w="full" maxW="150px" isInvalid={!!error}>
                  <FormLabel htmlFor="episode number">Episode Number</FormLabel>
                  <Input
                    type="number"
                    {...field}
                    value={isNaN(field.value as number) ? "" : (field.value as number).toString()}
                  />
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          )}
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
              {episodeId ? "Save" : "Create"}
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
