import { Box, HStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "src/components/Sidebar/Sidebar";

export const SidebarLayout = () => {
  return (
    <HStack h="100vh">
      <Sidebar />
      <Box h="full" w="full" p={8}>
        <Outlet />
      </Box>
    </HStack>
  );
};
