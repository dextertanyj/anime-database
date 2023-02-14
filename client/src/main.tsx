import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";

import * as ReactDOM from "react-dom/client";

import { router } from "./routes/routes";
import { theme } from "./theme/theme";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={client}>
			<ReactQueryDevtools initialIsOpen={false} />
			<ChakraProvider theme={theme}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<RouterProvider router={router} />
			</ChakraProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
