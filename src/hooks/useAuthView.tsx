import { useState, useCallback } from "react";
import { AuthView } from "../types/auth.types";

export const useAuthView = (initial: AuthView = "login") => {
  const [view, setView] = useState<AuthView>(initial);

  return {
    view,
    toLogin: useCallback(() => setView("login"), []),
    toRegister: useCallback(() => setView("register"), []),
    toForgot: useCallback(() => setView("forgot"), []),
    toCheck: useCallback(() => setView("check"), []),
    toReset: useCallback(() => setView("reset"), []),
    setView,
  };
};
