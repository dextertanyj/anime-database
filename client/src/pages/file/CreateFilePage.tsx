import { useNavigate, useParams } from "react-router-dom";

import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateFileForm } from "./form/CreateUpdateFileForm";

export const CreateFilePage = () => {
  const { episodeId } = useParams();
  const navigate = useNavigate();

  if (!episodeId) {
    navigate(-1);
    return null;
  }

  return (
    <FormLayout title={"Add A New File"}>
      <CreateUpdateFileForm episodeId={episodeId} />
    </FormLayout>
  );
};
