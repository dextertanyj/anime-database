import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";

import * as ReactDOM from "react-dom/client";

import { router } from "./routes/routes";
import { client } from "./services/query-client.service";
import { theme } from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ChakraProvider theme={theme}>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
