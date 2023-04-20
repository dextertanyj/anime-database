import { useCallback } from "react";
import { Stack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { ItemPageHeader } from "src/components/ItemPageHeader";
import { SeriesQuery } from "src/generated/graphql";
import { series } from "src/hooks/operations/useSeries";
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
  const navigate = useNavigate();
  const { data: { series: seriesData } = {} } = series.useGet({ id: seriesId ?? "" });
  const { mutate: deleteSeries, isLoading } = series.useDelete();

  const onDelete = useCallback(
    (onSuccess?: () => void) => {
      deleteSeries(
        { id: seriesId ?? "" },
        {
          onSuccess: () => {
            onSuccess && onSuccess();
            navigate("/inventory");
          },
        },
      );
    },
    [navigate, deleteSeries, seriesId],
  );

  if (!seriesId) {
    navigate(-1);
    return null;
  }

  if (!seriesData) {
    return null;
  }

  return (
    <Stack w="full" maxW="950px" spacing={6}>
      <ItemPageHeader
        type="series"
        item={seriesData}
        onDelete={onDelete}
        isDeleteLoading={isLoading}
      />
      <SeriesInformationCard data={seriesData} />
      {hasRelatedSeries(seriesData) && <RelatedAnimesCard data={seriesData} />}
      <EpisodesTable single={seriesData.type.singular} data={seriesData.episodes} />
    </Stack>
  );
};
