import { useNavigate, useParams } from "react-router-dom";

import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateSeriesForm } from "./forms/CreateUpdateSeriesForm";

export const UpdateSeriesPage = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();

  if (!seriesId) {
    navigate(-1);
    return null;
  }
  return (
    <FormLayout title={"Edit An Anime"}>
      <CreateUpdateSeriesForm seriesId={seriesId} />
    </FormLayout>
  );
};
