import { useNavigate, useParams } from "react-router-dom";

import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateSeriesForm } from "./components/CreateUpdateSeriesForm";

export const UpdateSeriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    navigate(-1);
    return null;
  }
  return (
    <FormLayout title={"Edit An Anime"}>
      <CreateUpdateSeriesForm seriesId={id} />
    </FormLayout>
  );
};
