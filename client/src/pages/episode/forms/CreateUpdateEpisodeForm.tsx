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
import { NumericInput } from "src/components/NumericInput";
import { episode } from "src/hooks/operations/useEpisode";
import { series } from "src/hooks/operations/useSeries";
import { numberSchemaBuilder } from "src/utilities/validation.utilities";

const schema = z.object({
  title: z.string().trim().nonempty("Title is required."),
  alternativeTitles: z
    .object({ title: z.string().trim().nonempty("Title cannot be empty.") })
    .array(),
  episodeNumber: numberSchemaBuilder("Episode number", { required: true, constraint: "positive" }),
  remarks: z.string(),
});

type CreateUpdateEpisodeFormState = z.infer<typeof schema>;

export const CreateUpdateEpisodeForm = ({
  seriesId,
  episodeId,
}: {
  seriesId: string;
  episodeId?: string;
}) => {
  const navigate = useNavigate();
  const toast = useToast({ position: "top", status: "success" });
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);

  const { mutate: create } = episode.useCreate();
  const { mutate: update } = episode.useUpdate();

  const { data: { series: seriesMetadata } = {} } = series.useGetMetadata({ id: seriesId });
  const { data: { episode: data } = {} } = episode.useGetEditable({ id: episodeId ?? "" });

  const methods = useForm<CreateUpdateEpisodeFormState>({
    resolver: zodResolver(
      seriesMetadata?.type.singular ? schema.omit({ episodeNumber: true }) : schema,
    ),
    defaultValues: {
      title: "",
      alternativeTitles: [],
      episodeNumber: NaN,
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
    if (episodeId && data) {
      setValue("title", data.title);
      setValue(
        "alternativeTitles",
        data.alternativeTitles.map((t) => ({ title: t })),
      );
      setValue("episodeNumber", data.episodeNumber ?? NaN);
      setValue("remarks", data.remarks ?? "");
      setShowAlternativeTitles(data.alternativeTitles.length > 0);
    }
  }, [episodeId, data, setValue]);

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
    if (data) {
      reset({
        title: data.title,
        alternativeTitles: data.alternativeTitles.map((t) => ({ title: t })),
        episodeNumber: data.episodeNumber ?? NaN,
        remarks: data.remarks ?? "",
      });
    } else {
      reset({ alternativeTitles: [] });
    }
  }, [reset, data]);

  if (!seriesMetadata || (episodeId && !data)) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
          {seriesMetadata.type.singular || (
            <Controller
              name="episodeNumber"
              render={({ field, fieldState: { error } }) => (
                <FormControl w="full" maxW="150px" isRequired isInvalid={!!error}>
                  <FormLabel htmlFor="episode number">Episode Number</FormLabel>
                  <NumericInput id="episode number" {...field} value={field.value as number} />
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
                <Textarea id="remarks" {...field} />
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
