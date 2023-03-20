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
import { episode } from "src/hooks/operations/useEpisode";
import { useIsMobile } from "src/hooks/useIsMobile";

export const EpisodePage = () => {
  const { episodeId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const { data } = episode.useGet({ id: episodeId ?? "" });

  if (!episodeId) {
    navigate(-1);
    return null;
  }

  if (!data?.episode) {
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
            <BreadcrumbLink href={`/series/${data.episode.series.id}`}>
              {data.episode.series.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{data.episode.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack justifyContent="space-between">
          <HStack alignItems="center">
            <Heading size="xl">{data.episode.title}</Heading>
            {data.episode.alternativeTitles.length > 0 && (
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
              <Button colorScheme="red" variant="outline">
                Delete
              </Button>
            </HStack>
          )}
        </HStack>
        <Collapse in={showAlternativeTitles}>
          {data.episode.alternativeTitles.map((title, index) => (
            <div key={index}>{title}</div>
          ))}
        </Collapse>
      </Stack>
    </Stack>
  );
};
