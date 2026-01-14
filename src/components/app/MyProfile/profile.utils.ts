export const phoneRegex = /^[0-9\s+()-]{9,15}$/;

export const getUserPhone = (user: any) =>
  user?.phones?.mobile || user?.phones?.phone || "";
