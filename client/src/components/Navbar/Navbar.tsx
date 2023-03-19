import { useCallback, useState } from "react";
import {
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
} from "@chakra-ui/react";

import {
  BiChevronsLeft,
  BiChevronsRight,
  BiCog,
  BiHome,
  BiLayer,
  BiLogOut,
  BiMenu,
  BiMoon,
  BiSun,
} from "react-icons/bi";
import { useUser } from "src/contexts/UserContext";
import { Role, UserSession } from "src/generated/graphql";

import { NavbarButton } from "./NavbarButton";
import { NavigationButton } from "./NavigationButton";

const NavigationButtons = ({
  expanded,
  user,
}: {
  expanded?: boolean;
  user?: UserSession | null;
}) => {
  return (
    <>
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
    </>
  );
};

export const Navbar = () => {
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
          <NavigationButtons user={user} expanded={expanded} />
        </Stack>
        <Stack spacing={1}>
          <NavbarButton
            Icon={BiLogOut}
            onClick={logout}
            description={"Logout"}
            collapsed={!expanded}
          />
          <NavbarButton
            Icon={colorMode === "light" ? BiMoon : BiSun}
            description={colorMode === "light" ? "Dark Mode" : "Light Mode"}
            collapsed={!expanded}
            onClick={toggleColorMode}
          />
          <NavbarButton
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

export const MobileNavbar = () => {
  const { user, logout } = useUser();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <HStack bgColor="teal.600" h="full" justifyContent="space-evenly">
      <NavigationButtons user={user} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <MenuButton
          as={NavbarButton}
          Icon={BiMenu}
          collapsed={true}
          w="auto"
          onClick={() => setIsMenuOpen((v) => !v)}
        />
        <MenuList w="fit-content">
          <MenuItem icon={colorMode === "light" ? <BiMoon /> : <BiSun />} onClick={toggleColorMode}>
            {colorMode === "light" ? "Dark Mode" : "Light Mode"}
          </MenuItem>
          <MenuItem icon={<BiLogOut />} onClick={logout}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};
