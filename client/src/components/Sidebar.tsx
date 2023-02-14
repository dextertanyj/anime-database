import { Button, Stack } from "@chakra-ui/react";

import { useUser } from "src/contexts/UserContext";

export const Sidebar = () => {
  const { logout } = useUser();
  return (
    <Stack width={{ base: "176px" }}>
      <Button onClick={logout}>Logout</Button>
    </Stack>
  );
};
