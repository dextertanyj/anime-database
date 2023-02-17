import { HStack } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "src/components/Sidebar/Sidebar";

export const SidebarLayout = () => {
  return (
    <HStack h="100vh">
      <Sidebar />
      <Outlet />
    </HStack>
  );
};
