import { useNavigate, useParams } from "react-router-dom";

import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateEpisodeForm } from "./components/CreateUpdateEpisodeForm";

export const UpdateEpisodePage = () => {
  const { seriesId, episodeId } = useParams();
  const navigate = useNavigate();

  if (!seriesId || !episodeId) {
    navigate(-1);
    return null;
  }

  return (
    <FormLayout title={"Edit An Episode"}>
      <CreateUpdateEpisodeForm seriesId={seriesId} episodeId={episodeId} />
    </FormLayout>
  );
};
