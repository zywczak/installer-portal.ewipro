import axios from "axios";
import { Project, SubcontractorInfo } from "./types";

export const fetchSubcontractorData = async (subcontractorId: string) => {
  const token = localStorage.getItem("access");

  const res = await axios.post(
    "https://api-veen-e.ewipro.com/installer/info/",
    { action: "getProjectsList", filters: [], sort: "projectIDDESC" },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const allProjects = Array.isArray(res.data?.projects) ? res.data.projects : [];

  // MOCK subcontractor info
  const info: SubcontractorInfo = {
    name: "Jan Kowalski",
    email: "email@example.com",
    mobile: "07123416788",
    companyName: "Firma Testowa",
    isRegistered: true,
  };

  return { allProjects, info };
};

export const filterProjectsBySubcontractor = (
  allProjects: any[],
  subcontractorId: string
): any[] => {
  const userID = localStorage.getItem("userID") || "";

  return allProjects.filter((item: any) => {
    const isOwner = item.owner?.installerID?.toString() === userID;

    const members = Array.isArray(item.members) ? item.members : [];
    const isMember = members.some(
      (m: any) =>
        m.installerID?.toString() === subcontractorId ||
        m.userID?.toString() === subcontractorId ||
        m.memberID?.toString() === subcontractorId
    );

    return isOwner && isMember;
  });
};

export const mapProjectData = (
  projectsData: any[],
  subcontractorId: string
): Project[] => {
  return projectsData.map((item: any) => {
    const postcode = item.postcode || "";
    const fullAddress = `${item.address1 || ""} ${item.address2 || ""} ${item.address3 || ""}`.trim();
    const isOwner = item.owner?.installerID?.toString() === subcontractorId;
    const isWarranty = item.type_name === "Warranty";

    const members: Project["members"] = [];

    if (item.owner) {
      members.push({
        installerID: item.owner.installerID?.toString() || "",
        name: item.owner.name || "",
        avatar: item.owner.avatar || null,
      });
    }

    if (Array.isArray(item.members)) {
      members.push(
        ...item.members.map((m: any) => ({
          installerID: m.userID?.toString() || m.memberID?.toString() || "",
          name: m.name || "",
          avatar: m.avatar || null,
        }))
      );
    }

    return {
      id: item.id?.toString() || "-",
      contactID: item.contactID?.toString() || "",
      projectCode: item.projectCode || "-",
      address: {
        postcode,
        full: `${postcode} ${fullAddress}`,
        rest: fullAddress,
      },
      stage:
        item.projectStage && item.projectMaxStage
          ? `${Math.min(item.projectStage, item.projectMaxStage)}/${item.projectMaxStage}`
          : "-",
      status: item.projectStatusName === "Closed" ? "Closed" : "Open",
      accessType: isOwner ? "Owner" : "Member",
      totalValue: item.projectValue ? `£${item.projectValue}` : "---",
      myValue: item.myProjectValue ? `£${item.myProjectValue}` : "£0.00",
      isOwner,
      isWarranty,
      members,
    };
  });
};