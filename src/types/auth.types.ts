export type AuthView = "login" | "register" | "check" | "forgot" | "reset";

export interface AuthNotification {
  message: string;
  type: "error" | "success";
}
