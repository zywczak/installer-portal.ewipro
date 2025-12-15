import { Project } from "../components/common/projects&subcontractors/projects/types";

export const mapProjectData = (item: any, userID: string): Project => {
  const postcode = item.postcode || "";
  const fullAddress = `${item.address1 || ""} ${item.address2 || ""} ${item.address3 || ""}`.trim();
  const isOwner = item.owner?.installerID?.toString() === userID;
  const isWarranty = item.type_name === "Warranty";

  const membersList: Project["members"] = [];

  if (item.owner) {
    membersList.push({
      installerID: item.owner.installerID?.toString() || "",
      name: item.owner.name || "",
      avatar: item.owner.avatar || null,
    });
  }

  if (Array.isArray(item.members)) {
    membersList.push(
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
      full: `${postcode} ${fullAddress}`.trim(),
      rest: fullAddress,
    },
    stage:
      item.projectStage && item.projectMaxStage
        ? `${Math.min(item.projectStage, item.projectMaxStage)}/${item.projectMaxStage}`
        : "-",
    status: item.projectStatusName === "Closed" ? "Closed" : "Open",
    accessType: isOwner ? "Owner" : "Member",
    totalValue: item.projectValue && item.projectValue !== false ? `£${item.projectValue}` : "---",
    myValue: item.myProjectValue ? `£${item.myProjectValue}` : "£0.00",
    isOwner,
    isWarranty,
    members: membersList,
  };
};
