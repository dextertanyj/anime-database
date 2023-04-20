import { Button, Heading, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useIsMobile } from "src/hooks/useIsMobile";

export const FileSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <HStack justifyContent="space-between">
      <Heading size="lg">Files</Heading>
      {isMobile || <Button onClick={() => navigate("file/create")}>Add</Button>}
    </HStack>
  );
};
