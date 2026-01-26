import { useEffect } from "react";
import { ProjectDetails } from "./types";

export const useAddressSync = (
  project: ProjectDetails | null,
  activeTab: string,
  onAddressChange?: (addr: string | null) => void
) => {
  useEffect(() => {
    if (onAddressChange && project && activeTab !== "home") {
      const addr = [project.address1, project.address2, project.address3, project.postcode]
        .filter(Boolean)
        .join(", ");
      onAddressChange(addr || null);
    } else if (onAddressChange && activeTab === "home") {
      onAddressChange(null);
    }
  }, [project, activeTab, onAddressChange]);
};