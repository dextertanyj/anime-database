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
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { BiChevronRight } from "react-icons/bi";
import { AccordionIcon } from "src/components/AccordionIcon";
import { Episode, Series } from "src/generated/graphql";
import { useIsMobile } from "src/hooks/useIsMobile";

import { ConfirmationModal, useConfirmationModal } from "./ConfirmationModal/ConfirmationModal";

type EpisodePageHeaderProps = {
  type: "episode";
  item: Pick<Episode, "id" | "title" | "alternativeTitles"> & {
    series: Pick<Episode["series"], "id" | "title">;
  };
};

type SeriesPageHeaderProps = {
  type: "series";
  item: Pick<Series, "id" | "title" | "alternativeTitles">;
};

type ItemPageHeaderProps = (EpisodePageHeaderProps | SeriesPageHeaderProps) & {
  onDelete: (onSuccess?: () => void) => void;
  isDeleteLoading?: boolean;
};

const EpisodeBreadcrumb = (props: EpisodePageHeaderProps) => {
  return (
    <Breadcrumb spacing={2} pb={2} separator={<BiChevronRight color="gray.500" />}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/series/${props.item.series.id}`}>
          {props.item.series.title}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>{props.item.title}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

const SeriesBreadcrumb = (props: SeriesPageHeaderProps) => {
  return (
    <Breadcrumb spacing={2} pb={2} separator={<BiChevronRight color="gray.500" />}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink>{props.item.title}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export const ItemPageHeader = ({ type, item, onDelete, isDeleteLoading }: ItemPageHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const { onOpen, onClose, isOpen } = useConfirmationModal();

  return (
    <Stack spacing={0}>
      {type === "episode" ? (
        <EpisodeBreadcrumb type={type} item={item} />
      ) : (
        <SeriesBreadcrumb type={type} item={item} />
      )}
      <HStack justifyContent="space-between">
        <HStack alignItems="center">
          <Heading size="xl">{item.title}</Heading>
          {item.alternativeTitles.length > 0 && (
            <IconButton
              icon={<AccordionIcon isExpanded={showAlternativeTitles} fontSize="3xl" />}
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
              title={`Delete ${type === "episode" ? "Episode" : "Anime"}?`}
              description="This action cannot be undone."
              confirmText="Delete"
              isLoading={isDeleteLoading}
              onConfirm={onDelete}
            />
          </HStack>
        )}
      </HStack>
      <Collapse in={showAlternativeTitles}>
        {item.alternativeTitles.map((title, index) => (
          <Text key={index} fontSize="lg">
            {title}
          </Text>
        ))}
      </Collapse>
    </Stack>
  );
};
