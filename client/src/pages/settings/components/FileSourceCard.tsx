import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

import { EditableList } from "src/components/EditableList/EditableList";
import { fileSource } from "src/hooks/operations/useFileSource";

import { FileSourceEntry } from "./FileSourceEntry";

export const FileSourceCard = () => {
  const { data } = fileSource.useGetAll();

  return (
    <Card h="full">
      <CardHeader pb={0}>
        <Heading size="md">Media Sources</Heading>
      </CardHeader>
      <CardBody>
        {!data ? null : <EditableList data={data.fileSources} ListElement={FileSourceEntry} />}
      </CardBody>
    </Card>
  );
};
