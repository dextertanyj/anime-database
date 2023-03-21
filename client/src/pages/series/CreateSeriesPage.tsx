import { FormLayout } from "src/layouts/FormLayout";

import { CreateUpdateSeriesForm } from "./forms/CreateUpdateSeriesForm";

export const CreateSeriesPage = () => {
  return (
    <FormLayout title={"Add A New Anime"}>
      <CreateUpdateSeriesForm />
    </FormLayout>
  );
};
