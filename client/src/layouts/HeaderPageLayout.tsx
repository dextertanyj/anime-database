import { PropsWithChildren, ReactNode } from "react";
import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const HeaderPageLayout = ({
  title,
  HeaderAdronment,
  children,
}: PropsWithChildren<{ title: string; HeaderAdronment?: ReactNode }>) => {
  return (
    <Stack spacing={6} w="full" maxW="1400px">
      <HStack justifyContent="space-between" alignItems="center">
        <Heading>{title}</Heading>
        <div>{HeaderAdronment ?? null}</div>
      </HStack>
      <Box h="fit-content" w="full">
        {children || <Outlet />}
      </Box>
    </Stack>
  );
};
