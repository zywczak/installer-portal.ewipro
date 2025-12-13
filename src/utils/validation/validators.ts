import { emailPattern, phonePattern, passwordPattern } from "./patterns";

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required.";
  if (!emailPattern.test(email)) return "Invalid email format.";
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required.";
  if (!phonePattern.test(phone)) return "Invalid phone number.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < passwordPattern.min) return "Password must be at least 8 characters.";
  if (!passwordPattern.upper.test(password)) return "Password must contain an uppercase letter.";
  if (!passwordPattern.digit.test(password)) return "Password must contain a number.";
  return null;
};
