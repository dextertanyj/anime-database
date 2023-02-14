import { HStack } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "src/components/Sidebar";

export const SidebarLayout = () => {
	return (
		<HStack>
			<Sidebar />
			<Outlet />
		</HStack>
	);
};
