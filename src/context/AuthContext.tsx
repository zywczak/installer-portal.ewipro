import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { AuthNotification } from "../types/auth.types";

interface AuthContextType {
  notification: AuthNotification | null;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clearNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<AuthNotification | null>(null);

  const showError = (message: string) => setNotification({ message, type: "error" });
  const showSuccess = (message: string) => setNotification({ message, type: "success" });
  const clearNotification = () => setNotification(null);

  const value = useMemo(() => ({
    notification,
    showError,
    showSuccess,
    clearNotification
  }), [notification]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthNotification = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthNotification must be used within AuthProvider");
  return context;
};
