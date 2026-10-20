import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { api, setToken } from "../lib/api";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const me = useCallback(async () => {
    try {
      const result = await api("/api/me");
      setUser(result.user);
      return result.user;
    } catch {
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => { me(); }, [me]);

  const login = useCallback(async (email, password) => {
    setLoginErrorMsg("");
    try {
      const result = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setToken(result.token);
      setUser(result.user);
      return true;
    } catch (error) {
      setToken(null);
      setUser(null);
      setLoginErrorMsg(error.message);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try { await api("/api/auth/logout", { method: "POST" }); }
    catch { /* Clear the local login state even if the server is unavailable. */ }
    finally { setToken(null); setUser(null); }
  }, []);

  const value = useMemo(() => ({
    user, login, logout, me, isLoggedIn: !!user, isInitializing,
    loginErrorMsg, isLogInError: !!loginErrorMsg,
  }), [user, login, logout, me, isInitializing, loginErrorMsg]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
