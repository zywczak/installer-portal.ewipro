import React, { createContext, useContext, useState, ReactNode } from "react";
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

  return (
    <AuthContext.Provider value={{ notification, showError, showSuccess, clearNotification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthNotification = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthNotification must be used within AuthProvider");
  return context;
};
