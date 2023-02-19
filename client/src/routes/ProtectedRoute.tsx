import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useUser } from "src/contexts/UserContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      return;
    }
    void navigate({ to: "/" });
  }, [navigate, user]);

  return user ? children : null;
};
