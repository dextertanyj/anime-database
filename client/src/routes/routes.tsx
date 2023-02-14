import { Outlet, ReactRouter, RootRoute, Route } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { UserProvider } from "src/contexts/UserContext";
import { SidebarLayout } from "src/layouts/SidebarLayout";
import { DashboardPage } from "src/pages/DashboardPage";
import { LoginPage } from "src/pages/LoginPage";
import { GenericErrorToastContainer } from "src/services/generic-error.service";

const rootRoute = new RootRoute({
  component: () => {
    return (
      <>
        <GenericErrorToastContainer />
        <UserProvider>
          <Outlet />
          <TanStackRouterDevtools position="bottom-right" />
        </UserProvider>
      </>
    );
  },
});
const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const sidebarLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "sidebar-layout",
  component: SidebarLayout,
});
const dashboardRoute = new Route({
  getParentRoute: () => sidebarLayoutRoute,
  path: "dashboard",
  component: DashboardPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  sidebarLayoutRoute.addChildren([dashboardRoute]),
]);

export const router = new ReactRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
