import { useEffect } from "react";
import { Outlet, To, useLocation, useNavigate } from "react-router-dom";

import { useUser } from "src/contexts/UserContext";
import { Role } from "src/generated/graphql";

export const ProtectedRoute = ({ roles = Object.values(Role) }: { roles?: Role[] }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user === null) {
      navigate("/", { state: { redirect: location.pathname as To } });
      return;
    }
    if (!roles.includes(user.role)) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, roles, user]);

  return user && roles.includes(user.role) ? <Outlet /> : null;
};
