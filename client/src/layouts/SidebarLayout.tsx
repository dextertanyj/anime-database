import { Box, HStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "src/components/Sidebar/Sidebar";

export const SidebarLayout = () => {
  return (
    <HStack h="100vh">
      <Sidebar />
      <Box h="full" w="full" overflowY="auto" justifyContent="center" display="flex" p={8}>
        <Outlet />
      </Box>
    </HStack>
  );
};
