import { Button, Card, CardBody, Heading, HStack, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { EpisodeQuery } from "src/generated/graphql";
import { useIsMobile } from "src/hooks/useIsMobile";

import { FileInformationCard } from "./components/FileInformationCard";

type FileSectionProps = {
  files: NonNullable<EpisodeQuery["episode"]>["files"];
  episodeId: string;
};

export const FileSection = ({ files, episodeId }: FileSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Stack spacing={4}>
      <HStack justifyContent="space-between">
        <Heading size="lg">Files</Heading>
        {isMobile || <Button onClick={() => navigate("file/create")}>Add</Button>}
      </HStack>
      {files.length === 0 && (
        <Card size={["sm", "md"]}>
          <CardBody textAlign="center">
            <Heading size="md">No files found.</Heading>
          </CardBody>
        </Card>
      )}
      {files.map((file) => (
        <FileInformationCard key={file.id} data={file} episodeId={episodeId} />
      ))}
    </Stack>
  );
};
