import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";

import { UserProvider } from "src/contexts/UserContext";
import { Role } from "src/generated/graphql";
import { SidebarLayout } from "src/layouts/SidebarLayout";
import { DashboardPage } from "src/pages/DashboardPage";
import { InventoryPage } from "src/pages/InventoryPage";
import { LoginPage } from "src/pages/LoginPage";
import { LogoutPage } from "src/pages/LogoutPage";
import { CreateSeriesPage } from "src/pages/series/CreateSeriesPage";
import { SeriesPage } from "src/pages/series/SeriesPage";
import { UpdateSeriesPage } from "src/pages/series/UpdateSeriesPage";
import { SettingsPage } from "src/pages/settings/SettingsPage";
import { SetupPage } from "src/pages/SetupPage";

import { ProtectedRoute } from "./ProtectedRoute";

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
          {
            element: <ProtectedRoute />,
            children: [
              {
                element: <SidebarLayout />,
                children: [
                  {
                    path: "dashboard",
                    element: <DashboardPage />,
                  },
                  {
                    path: "inventory",
                    element: <InventoryPage />,
                  },
                  {
                    path: "series",
                    children: [
                      { path: "create", element: <CreateSeriesPage /> },
                      { path: ":id", element: <SeriesPage /> },
                      { path: ":id/edit", element: <UpdateSeriesPage /> },
                    ],
                  },
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
