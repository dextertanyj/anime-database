import { createContext, PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { To, useNavigate } from "react-router-dom";

import { LoginMutationVariables, UserSession } from "src/generated/graphql";
import { useIsLoggedIn, useLogin, useLogout } from "src/hooks/useSessions";
import { useStateWithCallback } from "src/hooks/useStateWithCallback";
import { handleError } from "src/services/generic-error.service";

type UserContextProps = {
  user: UserSession | null | undefined;
  login: (input: LoginMutationVariables, redirect?: To) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const toast = useToast({ position: "top" });
  const { data, isFetched } = useIsLoggedIn();
  const login = useLogin();
  const logout = useLogout();

  const [user, setUser] = useStateWithCallback<UserSession | null | undefined>(undefined);

  useEffect(() => {
    if (!isFetched) {
      return;
    }
    if (data?.session) {
      setUser(data.session);
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, data?.session]);

  const loginCallback = useCallback(
    (input: LoginMutationVariables, redirect?: To) => {
      login.mutate(input, {
        onSuccess: (data) => {
          setUser(data.createSession, () => navigate(redirect ?? "dashboard"));
        },
        onError: (error) => {
          if (!error.response.errors) {
            handleError(error);
            return;
          }
          if (error.response.errors.find((err) => err.extensions.response?.statusCode === 401)) {
            toast({
              description: "Incorrect email or username.",
              status: "error",
            });
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [login, navigate, toast],
  );

  const logoutCallback = useCallback(() => {
    try {
      logout.mutate();
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setUser(null, () => navigate("/"));
      toast({ description: "Logged out", status: "success" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, navigate, toast]);

  return (
    <UserContext.Provider
      value={{
        user,
        login: loginCallback,
        logout: logoutCallback,
      }}
    >
      {user === undefined ? (
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

/**
 * Hook for components nested in ProvideUser component to get the current user object.
 */
export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useUser must be used within a UserProvider component`);
  }
  return context;
};
