export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\+?\d{9,15}$/;

export const passwordPattern = {
  min: 8,
  upper: /[A-Z]/,
  digit: /\d/,
};
