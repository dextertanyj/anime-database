import { Box, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { MobileNavbar, Navbar } from "src/components/Navbar/Navbar";
import { useIsMobile } from "src/hooks/useIsMobile";

export const NavbarLayout = () => {
  const isMobile = useIsMobile();

  return (
    <Stack h="$100vh" direction={isMobile ? "column" : "row-reverse"}>
      <Box
        overflowY="auto"
        w="full"
        display="flex"
        justifyContent="center"
        marginBottom={isMobile ? "40px" : "unset"}
        p={isMobile ? 4 : 8}
      >
        <Outlet />
      </Box>
      {isMobile ? (
        <Box position="fixed" h="40px" bottom={0} w="full">
          <MobileNavbar />
        </Box>
      ) : (
        <Navbar />
      )}
    </Stack>
  );
};
