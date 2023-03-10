import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useUser } from "src/contexts/UserContext";
import { session } from "src/hooks/operations/useSession";

export const LogoutPage = () => {
  const { user } = useUser();
  const logout = session.useDelete();
  const navigate = useNavigate();
  const toast = useToast({ position: "top" });

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
    if (!user) {
      return;
    }
    logout.mutate({
      onSuccess: () => {
        toast({ id: "logout", description: "Logged out", status: "success" });
      },
      onError: () => {
        toast({
          id: "logout",
          description: "Something went wrong. Please try again.",
          status: "error",
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
};
