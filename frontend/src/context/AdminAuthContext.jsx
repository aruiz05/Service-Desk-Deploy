import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  clearAdminToken,
  getAdminStatus,
  loginAdmin,
  setAdminToken,
} from "../services/api.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function verifyExistingToken() {
      try {
        const status = await getAdminStatus();

        if (!isCurrent) {
          return;
        }

        if (status.authenticated && status.role === "admin") {
          setIsAdmin(true);
        } else {
          clearAdminToken();
          setIsAdmin(false);
        }
      } catch {
        if (isCurrent) {
          clearAdminToken();
          setIsAdmin(false);
        }
      } finally {
        if (isCurrent) {
          setIsCheckingAdmin(false);
        }
      }
    }

    verifyExistingToken();

    return () => {
      isCurrent = false;
    };
  }, []);

  async function signIn(credentials) {
    const loginResponse = await loginAdmin(credentials);
    setAdminToken(loginResponse.access_token);

    const status = await getAdminStatus();
    if (!status.authenticated || status.role !== "admin") {
      clearAdminToken();
      setIsAdmin(false);
      throw new Error("Unable to verify admin session.");
    }

    setIsAdmin(true);
    return loginResponse;
  }

  function signOut() {
    clearAdminToken();
    setIsAdmin(false);
  }

  const value = useMemo(
    () => ({
      isAdmin,
      isCheckingAdmin,
      signIn,
      signOut,
    }),
    [isAdmin, isCheckingAdmin],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (context === null) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }

  return context;
}
