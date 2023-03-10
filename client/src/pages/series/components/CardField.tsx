import { PropsWithChildren } from "react";
import { Stack, Text } from "@chakra-ui/react";

export const CardField = ({ title, children }: PropsWithChildren<{ title: string }>) => {
  return (
    <Stack spacing={1}>
      <Text color="gray.500">{title}</Text>
      {children}
    </Stack>
  );
};

export const TextCardField = ({ title, content }: { title: string; content: string | number }) => {
  return (
    <CardField title={title}>
      <Text fontSize="lg" fontWeight="medium">
        {content}
      </Text>
    </CardField>
  );
};
