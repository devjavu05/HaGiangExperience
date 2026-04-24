import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "ha_giang_auth";

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [auth]);

  const value = useMemo(() => ({
    user: auth?.user ?? null,
    isAuthenticated: Boolean(auth?.user?.id),
    isLocalHost: auth?.user?.role === "ROLE_LOCAL_HOST",
    login(authPayload) {
      setAuth(authPayload);
    },
    updateUser(nextUser) {
      setAuth((current) =>
        current
          ? {
              ...current,
              user: {
                ...current.user,
                ...nextUser
              }
            }
          : current
      );
    },
    logout() {
      setAuth(null);
    }
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
