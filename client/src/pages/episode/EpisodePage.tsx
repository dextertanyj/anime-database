import { useCallback } from "react";
import { Stack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { ItemPageHeader } from "src/components/ItemPageHeader";
import { episode } from "src/hooks/operations/useEpisode";

export const EpisodePage = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();

  const { data: { episode: episodeData } = {} } = episode.useGet({ id: episodeId ?? "" });
  const { mutate: deleteEpisode, isLoading } = episode.useDelete();

  const onDelete = useCallback(
    (onSuccess?: () => void) => {
      deleteEpisode(
        { id: episodeId ?? "" },
        {
          onSuccess: () => {
            onSuccess && onSuccess();
            navigate(`/series/${episodeData?.series.id || ""}`);
          },
        },
      );
    },
    [navigate, deleteEpisode, episodeId, episodeData],
  );

  if (!episodeId) {
    navigate(-1);
    return null;
  }

  if (!episodeData) {
    return null;
  }

  return (
    <Stack w="full" maxW="950px" spacing={4}>
      <ItemPageHeader
        type="episode"
        item={episodeData}
        onDelete={onDelete}
        isDeleteLoading={isLoading}
      />
    </Stack>
  );
};
