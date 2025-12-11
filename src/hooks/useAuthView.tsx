import { useState } from "react";

export type AuthView = "login" | "register" | "check" | "forgot";

export const useAuthView = (initial: AuthView = "login") => {
  const [view, setView] = useState<AuthView>(initial);
  const toLogin = () => setView("login");
  const toRegister = () => setView("register");
  const toForgot = () => setView("forgot");
  const toCheck = () => setView("check");

  return { view, setView, toLogin, toRegister, toForgot, toCheck };
};
