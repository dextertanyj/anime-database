import { useEffect } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { NumericInput } from "src/components/NumericInput";
import { file } from "src/hooks/operations/useFile";
import { destructureDuration, restructureDuration } from "src/utilities/duration.utilities";
import { numberSchemaBuilder } from "src/utilities/validation.utilities";
import isHash from "validator/es/lib/isHash";

import { CodecInput } from "./components/CodecInput";
import { DurationInput } from "./components/DurationInput";
import { ResolutionInput } from "./components/ResolutionInput";
import { SourceInput } from "./components/SourceInput";

const HashAlgorithms = ["crc32", "crc32b", "md5", "sha1", "sha256", "sha512"] as const;

const schema = z.object({
  path: z.string().nonempty("Location is required."),
  checksum: z
    .string()
    .nonempty("Checksum is required.")
    .refine((val) => HashAlgorithms.some((algo) => isHash(val, algo)), "Invalid checksum."),
  fileSize: numberSchemaBuilder("File size", { required: true }),
  duration: z
    .object({
      hours: numberSchemaBuilder("Duration", { constraint: "non-negative" }),
      minutes: numberSchemaBuilder("Duration", { constraint: "non-negative" }),
      seconds: numberSchemaBuilder("Duration", { constraint: "non-negative" }),
    })
    .refine(
      ({ hours, minutes, seconds }) => !(isNaN(hours) && isNaN(minutes) && isNaN(seconds)),
      "Duration is required.",
    )
    .refine(({ hours, minutes, seconds }) => {
      return (
        (!!hours || !!minutes || !!seconds) &&
        (isNaN(hours) || hours >= 0) &&
        (isNaN(minutes) || (minutes >= 0 && minutes < 60)) &&
        (isNaN(seconds) || (seconds >= 0 && seconds < 60))
      );
    }, "Invalid duration."),
  resolution: z
    .object({
      height: numberSchemaBuilder("Resolution height", {
        constraint: "positive",
        constraintErrorMessage: "Resolution dimensions must be positive.",
      }),
      width: numberSchemaBuilder("Resolution width", {
        constraint: "positive",
        constraintErrorMessage: "Resolution dimensions must be positive.",
      }),
    })
    .refine(({ height, width }) => !!(height && width), "Resolution is required."),
  codec: z.string().nonempty("Codec is required."),
  source: z.string().nonempty("Source is required."),
  remarks: z.string().trim(),
});

export type CreateUpdateFileFormState = z.infer<typeof schema>;

export const CreateUpdateFileForm = ({
  episodeId,
  fileId,
}: {
  episodeId: string;
  fileId?: string;
}) => {
  const { data: existing } = file.useGetEditable({ id: fileId ?? "" });
  const navigate = useNavigate();
  const toast = useToast({ position: "top", status: "success" });

  const methods = useForm<CreateUpdateFileFormState>({
    resolver: zodResolver(schema),
    defaultValues: {
      path: "",
      checksum: "",
      fileSize: NaN,
      duration: { hours: NaN, minutes: NaN, seconds: NaN },
      resolution: { height: NaN, width: NaN },
      codec: "",
      source: "",
      remarks: "",
    },
  });

  const { mutate: create } = file.useCreate({ episodeId });
  const { mutate: update } = file.useUpdate({ episodeId });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (fileId && existing?.file) {
      setValue("path", existing.file.path);
      setValue("checksum", existing.file.checksum);
      setValue("fileSize", existing.file.fileSize);
      setValue("duration", destructureDuration(existing.file.duration));
      setValue("codec", existing.file.codec);
      setValue("source", existing.file.source.id);
      setValue("resolution.height", existing.file.resolution.height);
      setValue("resolution.width", existing.file.resolution.width);
      setValue("remarks", existing.file.remarks ?? "");
    }
  }, [fileId, existing, setValue]);

  const onSubmit = (data: CreateUpdateFileFormState) => {
    const input = {
      ...data,
      checksum: data.checksum.toUpperCase(),
      duration: restructureDuration(data.duration),
      remarks: data.remarks || null,
    };
    if (fileId) {
      update(
        { id: fileId, input },
        {
          onSuccess: () => {
            toast({ description: "Successfully updated file record." });
            navigate("../..");
          },
        },
      );
      return;
    }
    create(
      { input: { ...input, episode: episodeId } },
      {
        onSuccess: () => {
          toast({ description: "Successfully created file record." });
          navigate("../..");
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          <Controller
            name="path"
            render={({ field, fieldState: { error } }) => (
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel htmlFor="location">Location</FormLabel>
                <Input id="location" {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="fileSize"
            render={({ field, fieldState: { error } }) => (
              <FormControl w="full" maxW="200px" isRequired isInvalid={!!error}>
                <FormLabel htmlFor="size">Size</FormLabel>
                <InputGroup>
                  <NumericInput id="size" {...field} value={field.value as number} />
                  <InputRightElement pointerEvents="none">B</InputRightElement>
                </InputGroup>
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <DurationInput />
          <Controller
            name="checksum"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                w="full"
                maxW={{ base: "200px", lg: "250px" }}
                isRequired
                isInvalid={!!error}
              >
                <FormLabel htmlFor="checksum">Checksum</FormLabel>
                <Input id="checksum" {...field} />
                <FormErrorMessage>{error && error.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <CodecInput />
          <ResolutionInput />
          <SourceInput />
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
          <Button w="fit-content" type="submit" isLoading={isSubmitting}>
            {fileId ? "Save" : "Create"}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
};
