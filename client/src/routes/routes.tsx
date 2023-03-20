import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";

import { UserProvider } from "src/contexts/UserContext";
import { Role } from "src/generated/graphql";
import { NavbarLayout } from "src/layouts/NavbarLayout";
import { LoginPage } from "src/pages/authentication/LoginPage";
import { LogoutPage } from "src/pages/authentication/LogoutPage";
import { DashboardPage } from "src/pages/dashboard/DashboardPage";
import { CreateEpisodePage } from "src/pages/episode/CreateEpisodePage";
import { EpisodePage } from "src/pages/episode/EpisodePage";
import { UpdateEpisodePage } from "src/pages/episode/UpdateEpisodePage";
import { InventoryPage } from "src/pages/inventory/InventoryPage";
import { CreateSeriesPage } from "src/pages/series/CreateSeriesPage";
import { SeriesPage } from "src/pages/series/SeriesPage";
import { UpdateSeriesPage } from "src/pages/series/UpdateSeriesPage";
import { SettingsPage } from "src/pages/settings/SettingsPage";
import { SetupPage } from "src/pages/setup/SetupPage";

import { ProtectedRoute } from "./ProtectedRoute";

const publicRoutes: RouteObject[] = [
  {
    path: "",
    element: <LoginPage />,
  },
  {
    path: "logout",
    element: <LogoutPage />,
  },
  {
    path: "setup",
    element: <SetupPage />,
  },
];

const episodeRouteGroup: RouteObject = {
  path: "episode",
  children: [
    { path: "create", element: <CreateEpisodePage /> },
    { path: ":episodeId", element: <EpisodePage /> },
    { path: ":episodeId/edit", element: <UpdateEpisodePage /> },
  ],
};

const seriesRouteGroup: RouteObject = {
  path: "series",
  children: [
    { path: "create", element: <CreateSeriesPage /> },
    {
      path: ":seriesId",
      children: [{ index: true, element: <SeriesPage /> }, episodeRouteGroup],
    },
    { path: ":seriesId/edit", element: <UpdateSeriesPage /> },
  ],
};

const privateRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "inventory",
    element: <InventoryPage />,
  },
  seriesRouteGroup,
];

const routes: RouteObject[] = [
  {
    children: [
      {
        path: "",
        element: (
          <UserProvider>
            <Outlet />
          </UserProvider>
        ),
        children: [
          ...publicRoutes,
          {
            element: <ProtectedRoute />,
            children: [
              {
                element: <NavbarLayout />,
                children: [
                  ...privateRoutes,
                  {
                    element: <ProtectedRoute roles={[Role.Admin, Role.Owner]} />,
                    children: [
                      {
                        path: "settings",
                        element: <SettingsPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
