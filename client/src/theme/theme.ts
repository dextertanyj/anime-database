import { extendTheme, ThemeConfig, withDefaultColorScheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export const theme = extendTheme(
  { config },
  withDefaultColorScheme({
    colorScheme: "teal",
  }),
);
