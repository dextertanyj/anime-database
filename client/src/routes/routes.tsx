import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";

import { UserProvider } from "src/contexts/UserContext";
import { Role } from "src/generated/graphql";
import { SidebarLayout } from "src/layouts/SidebarLayout";
import { DashboardPage } from "src/pages/DashboardPage";
import { InventoryPage } from "src/pages/InventoryPage";
import { LoginPage } from "src/pages/LoginPage";
import { SettingsPage } from "src/pages/SettingsPage";
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
            path: "setup",
            element: <SetupPage />,
          },
          {
            path: "",
            element: <ProtectedRoute />,
            children: [
              {
                path: "",
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
                    path: "",
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
