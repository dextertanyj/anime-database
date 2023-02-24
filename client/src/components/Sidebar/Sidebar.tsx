import { useCallback, useState } from "react";
import { Stack, useColorMode } from "@chakra-ui/react";

import {
  BiChevronsLeft,
  BiChevronsRight,
  BiCog,
  BiHome,
  BiLayer,
  BiLogOut,
  BiMoon,
  BiSun,
} from "react-icons/bi";
import { useUser } from "src/contexts/UserContext";
import { Role } from "src/generated/graphql";

import { NavigationButton } from "./NavigationButton";
import { SidebarButton } from "./SidebarButton";

export const Sidebar = () => {
  const { user, logout } = useUser();
  const { colorMode, toggleColorMode } = useColorMode();
  const [expanded, setExpanded] = useState<boolean>(true);

  const toggleExpanded = useCallback(() => {
    setExpanded((value) => !value);
  }, [setExpanded]);

  return (
    <Stack
      bgColor="teal.600"
      h="full"
      width={{ base: expanded ? 56 : 14 }}
      px={expanded ? 6 : 2}
      py={8}
      spacing={8}
    >
      <Stack justifyContent="space-between" h="full">
        <Stack spacing={1}>
          <NavigationButton
            to="/dashboard"
            Icon={BiHome}
            description={"Dashboard"}
            collapsed={!expanded}
          />
          <NavigationButton
            to="/inventory"
            Icon={BiLayer}
            description={"Inventory"}
            collapsed={!expanded}
          />
          {user?.role && [Role.Admin, Role.Owner].includes(user?.role) && (
            <NavigationButton
              to="/settings"
              Icon={BiCog}
              description={"Settings"}
              collapsed={!expanded}
            />
          )}
        </Stack>
        <Stack spacing={1}>
          <SidebarButton
            Icon={BiLogOut}
            onClick={logout}
            description={"Logout"}
            collapsed={!expanded}
          />
          <SidebarButton
            Icon={colorMode === "light" ? BiMoon : BiSun}
            description={colorMode === "light" ? "Dark Mode" : "Light Mode"}
            collapsed={!expanded}
            onClick={toggleColorMode}
          />
          <SidebarButton
            Icon={expanded ? BiChevronsLeft : BiChevronsRight}
            description={expanded ? "Collapse" : "Expand"}
            collapsed={!expanded}
            onClick={toggleExpanded}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
