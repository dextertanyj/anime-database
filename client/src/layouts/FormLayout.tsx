import { PropsWithChildren } from "react";
import { Center, Divider, Heading, Stack } from "@chakra-ui/react";

export const FormLayout = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <Center w="full">
      <Stack spacing={6} w="full" maxW="750px">
        <Heading>{title}</Heading>
        <Divider sx={{ mt: "12px !important", mb: "12px !important" }} />
        {children}
      </Stack>
    </Center>
  );
};
