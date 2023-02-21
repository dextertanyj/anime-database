import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useUser } from "src/contexts/UserContext";
import { Role } from "src/generated/graphql";

export const ProtectedRoute = ({ roles = Object.values(Role) }: { roles?: Role[] }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user !== null && roles.includes(user.role)) {
      return;
    }
    navigate("/");
  }, [navigate, roles, user]);

  return user && roles.includes(user.role) ? <Outlet /> : null;
};
