import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Collapse,
  Heading,
  HStack,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { BiChevronDown, BiChevronRight, BiChevronUp } from "react-icons/bi";
import {
  ConfirmationModal,
  useConfirmationModal,
} from "src/components/ConfirmationModal/ConfirmationModal";
import { episode } from "src/hooks/operations/useEpisode";
import { useIsMobile } from "src/hooks/useIsMobile";

export const EpisodePage = () => {
  const { episodeId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useConfirmationModal();

  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const { data } = episode.useGet({ id: episodeId ?? "" });
  const { mutate: deleteEpisode, isLoading } = episode.useDelete();

  if (!episodeId) {
    navigate(-1);
    return null;
  }

  const episodeData = data?.episode;

  if (!episodeData) {
    return null;
  }

  return (
    <Stack w="full" maxW="950px" spacing={4}>
      <Stack spacing={0}>
        <Breadcrumb spacing={2} pb={2} separator={<BiChevronRight color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/series/${episodeData.series.id}`}>
              {episodeData.series.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{episodeData.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack justifyContent="space-between">
          <HStack alignItems="center">
            <Heading size="xl">{episodeData.title}</Heading>
            {episodeData.alternativeTitles.length > 0 && (
              <IconButton
                icon={
                  showAlternativeTitles ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />
                }
                colorScheme="gray"
                variant="ghost"
                borderRadius="20px"
                size="sm"
                aria-label="alternative-titles"
                onClick={() => setShowAlternativeTitles((v) => !v)}
              />
            )}
          </HStack>
          {isMobile || (
            <HStack spacing={2}>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={() => {
                  navigate("edit");
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
                title="Delete Episode?"
                description="This action cannot be undone."
                confirmText="Delete"
                isLoading={isLoading}
                onConfirm={(onSuccess) => {
                  deleteEpisode(
                    { id: episodeId },
                    {
                      onSuccess: () => {
                        onSuccess();
                        navigate(`/series/${episodeData.series.id}`);
                      },
                    },
                  );
                }}
              />
            </HStack>
          )}
        </HStack>
        <Collapse in={showAlternativeTitles}>
          {episodeData.alternativeTitles.map((title, index) => (
            <div key={index}>{title}</div>
          ))}
        </Collapse>
      </Stack>
    </Stack>
  );
};
