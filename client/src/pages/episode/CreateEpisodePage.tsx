import { useNavigate, useParams } from "react-router-dom";

import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateEpisodeForm } from "./components/CreateUpdateEpisodeForm";

export const CreateEpisodePage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  if (!seriesId) {
    navigate(-1);
    return null;
  }

  return (
    <FormLayout title={"Add A New Episode"}>
      <CreateUpdateEpisodeForm seriesId={seriesId} />
    </FormLayout>
  );
};
