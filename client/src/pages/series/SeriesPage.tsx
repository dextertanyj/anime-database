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
import { SeriesQuery } from "src/generated/graphql";
import { series } from "src/hooks/operations/useSeries";
import { useIsMobile } from "src/hooks/useIsMobile";
import { RELATIONSHIPS } from "src/utilities/series-relations.utilities";

import { EpisodesTable } from "./components/EpisodesTable";
import { RelatedAnimesCard } from "./components/RelatedAnimesCard";
import { SeriesInformationCard } from "./components/SeriesInformationCard";

const hasRelatedSeries = (series: NonNullable<SeriesQuery["series"]>) => {
  return (
    RELATIONSHIPS.map((relationship) => series[relationship].length).reduce(
      (count, length) => count + length,
    ) !== 0
  );
};

export const SeriesPage = () => {
  const { seriesId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const { data } = series.useGet({ id: seriesId ?? "" });

  if (!seriesId) {
    navigate(-1);
    return null;
  }

  if (!data?.series) {
    return null;
  }

  return (
    <Stack w="full" maxW="950px" spacing={6}>
      <Stack spacing={0}>
        <Breadcrumb spacing={2} pb={2} separator={<BiChevronRight color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{data.series.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack justifyContent="space-between">
          <HStack alignItems="center">
            <Heading size="xl">{data.series.title}</Heading>
            {data.series.alternativeTitles.length > 0 && (
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
          {data.series.alternativeTitles.map((title, index) => (
            <div key={index}>{title}</div>
          ))}
        </Collapse>
      </Stack>
      <SeriesInformationCard data={data.series} />
      {hasRelatedSeries(data.series) && <RelatedAnimesCard data={data.series} />}
      <EpisodesTable data={data.series.episodes} />
    </Stack>
  );
};
