import { useNavigate, useParams } from "react-router-dom";

import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateFileForm } from "./form/CreateUpdateFileForm";

export const UpdateFilePage = () => {
  const { episodeId, fileId } = useParams();
  const navigate = useNavigate();

  if (!episodeId || !fileId) {
    navigate(-1);
    return null;
  }

  return (
    <FormLayout title={"Edit A File"}>
      <CreateUpdateFileForm episodeId={episodeId} fileId={fileId} />
    </FormLayout>
  );
};
