import { PropsWithChildren, ReactNode } from "react";
import { Center, Divider, Heading, HStack, Stack } from "@chakra-ui/react";

export const FormLayout = ({
  title,
  children,
  HeaderAdronment,
}: PropsWithChildren<{ title: string; HeaderAdronment?: ReactNode }>) => {
  return (
    <Center w="full">
      <Stack spacing={6} w="full" maxW="750px">
        <HStack justifyContent="space-between" alignItems="center">
          <Heading>{title}</Heading>
          <div>{HeaderAdronment ?? null}</div>
        </HStack>
        <Divider sx={{ mt: "12px !important", mb: "12px !important" }} />
        {children}
      </Stack>
    </Center>
  );
};
