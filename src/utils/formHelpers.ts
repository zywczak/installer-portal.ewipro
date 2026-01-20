import { FormData } from "../components/app/addProject/types";

export const getInitialOwnerId = (): number => {
  const defaultEnabled = JSON.parse(
    localStorage.getItem("defaultProjectOwner") || "false"
  );

  if (defaultEnabled) {
    const defaultOwnerId = Number(localStorage.getItem("defaultOwnerId"));
    if (defaultOwnerId) return defaultOwnerId;
  }

  const userID = Number(localStorage.getItem("userID"));
  return userID || 0;
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const isFormValid = (formData: FormData): boolean => {
  return !!(
    formData.postCode &&
    formData.addressLine1 &&
    formData.city &&
    formData.occupierName &&
    formData.buildType &&
    formData.substrate &&
    formData.system &&
    formData.pasRole &&
    formData.warrantyProvider &&
    formData.warrantyPeriod &&
    formData.ownerId
  );
};

export const canShowNextSteps = (
  isPostcodeValid: boolean | null,
  addressLine1: string,
  city: string
): boolean => {
  return (
    isPostcodeValid === true &&
    addressLine1.trim() !== "" &&
    city.trim() !== ""
  );
};
