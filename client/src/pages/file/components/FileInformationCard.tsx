import { useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import { TextCardField } from "src/components/Card/CardField";
import {
  ConfirmationModal,
  useConfirmationModal,
} from "src/components/ConfirmationModal/ConfirmationModal";
import { EpisodeQuery } from "src/generated/graphql";
import { file } from "src/hooks/operations/useFile";
import { useIsMobile } from "src/hooks/useIsMobile";
import { renderDuration } from "src/utilities/duration.utilities";
import { renderFileSize } from "src/utilities/file-size.utilities";
import { renderPath } from "src/utilities/path.utilities";
import { renderResolution } from "src/utilities/resolution.utilities";

export const FileInformationCard = ({
  data,
  episodeId,
}: {
  data: NonNullable<EpisodeQuery["episode"]>["files"][number];
  episodeId: string;
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useConfirmationModal();

  const { mutate: deleteFile, isLoading } = file.useDelete({ episodeId });

  const onDelete = useCallback(
    (onSuccess?: () => void) => {
      deleteFile(
        { id: data.id ?? "" },
        {
          onSuccess: () => {
            onSuccess && onSuccess();
          },
        },
      );
    },
    [deleteFile, data],
  );

  return (
    <Card size={["sm", "md"]}>
      <CardBody>
        <Stack spacing={4}>
          <HStack justifyContent="space-between" alignItems="start">
            <TextCardField title="Location" content={renderPath(data.path)} />
            {isMobile || (
              <HStack spacing={2}>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    navigate(`file/${data.id}/edit`);
                  }}
                >
                  Edit
                </Button>
                <Button colorScheme="red" variant="outline" onClick={onOpen}>
                  Delete
                </Button>
                <ConfirmationModal
                  isOpen={isOpen}
                  onClose={onClose}
                  title={`Delete File?`}
                  description="This action cannot be undone."
                  confirmText="Delete"
                  isLoading={isLoading}
                  onConfirm={onDelete}
                />
              </HStack>
            )}
          </HStack>
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4}>
            <TextCardField title="Resolution" content={renderResolution(data.resolution)} />
            <TextCardField title="Duration" content={renderDuration(data.duration)} />
            <TextCardField title="Size" content={renderFileSize(data.fileSize)} />
            <TextCardField title="Codec" content={data.codec} />
            <TextCardField title="Source" content={data.source.source} />
            <TextCardField title="Checksum" content={data.checksum} />
          </SimpleGrid>
          {data.remarks && <TextCardField title="Remarks" content={data.remarks} />}
        </Stack>
      </CardBody>
      <CardFooter>
        <Stack w="full" justifyContent="space-between" spacing={8}>
          <Text alignSelf="end" as="i" fontSize="sm">
            Last updated: {format(new Date(data.updatedAt), "yyyy-MM-dd hh:mm a")}
          </Text>
        </Stack>
      </CardFooter>
    </Card>
  );
};
