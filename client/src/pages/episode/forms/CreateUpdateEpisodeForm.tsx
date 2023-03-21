import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { AlternativeTitlesField } from "src/components/AlternativeTitlesField";
import { episode } from "src/hooks/operations/useEpisode";
import { series } from "src/hooks/operations/useSeries";
import { isNotWhitespaceOnly } from "src/utilities";
import isInt from "validator/es/lib/isInt";

export type CreateUpdateEpisodeFormProps = {
  seriesId: string;
  episodeId?: string;
};

export type CreateUpdateEpisodeFormState = {
  title: string;
  alternativeTitles: { title: string }[];
  episodeNumber: string;
  remarks: string;
};

export const CreateUpdateEpisodeForm = ({ seriesId, episodeId }: CreateUpdateEpisodeFormProps) => {
  const { data: seriesMetadata } = series.useGetMetadata({ id: seriesId });
  const { data: existing } = episode.useGetEditable({ id: episodeId ?? "" });
  const navigate = useNavigate();
  const toast = useToast({ position: "top", status: "success" });

  const methods = useForm<CreateUpdateEpisodeFormState>();
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);

  const { mutate: create } = episode.useCreate();
  const { mutate: update } = episode.useUpdate();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (episodeId && existing?.episode) {
      setValue("title", existing.episode.title);
      setValue(
        "alternativeTitles",
        existing.episode.alternativeTitles.map((t) => ({ title: t })),
      );
      setValue("episodeNumber", existing.episode.episodeNumber?.toString() || "");
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
              defaultValue={""}
              rules={{
                required: "Title is required.",
                validate: (value: string) => isNotWhitespaceOnly(value) || "Title cannot be empty.",
              }}
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
              defaultValue={""}
              rules={{
                validate: (value: string) =>
                  value === "" || isInt(value) || "Episode number must be an integer.",
              }}
              render={({ field, fieldState: { error } }) => (
                <FormControl w="full" maxW="150px" isInvalid={!!error}>
                  <FormLabel htmlFor="episode number">Episode Number</FormLabel>
                  <NumberInput value={field.value as string} min={1}>
                    <NumberInputField {...field} />
                  </NumberInput>
                  <FormErrorMessage>{error && error.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          )}
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
            {episodeId ? "Save" : "Create"}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};
