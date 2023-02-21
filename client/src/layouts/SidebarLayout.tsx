import { HStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "src/components/Sidebar/Sidebar";

export const SidebarLayout = () => {
  return (
    <HStack h="100vh">
      <Sidebar />
      <Outlet />
    </HStack>
  );
};
