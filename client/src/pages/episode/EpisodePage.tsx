import { useNavigate, useParams } from "react-router-dom";

import { episode } from "src/hooks/operations/useEpisode";

export const EpisodePage = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();

  const { data } = episode.useGet({ id: episodeId ?? "" });

  if (!episodeId) {
    navigate(-1);
    return null;
  }

  if (!data?.episode) {
    return null;
  }

  return <div>EpisodePage</div>;
};
