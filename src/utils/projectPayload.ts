import { FormData, TeamMember } from "../components/common/steps/types";
import {
  mapBuildTypeToId,
  mapSubstrateToId,
  mapSystemToId,
  mapWarrantyProviderToId,
  cleanAddress,
} from "./projectMappers";

export interface ProjectPayload {
  action: string;
  address1: string;
  address2: string;
  address3: string;
  postCode: string;
  startDate: string;
  accreditedProject: number;
  buildType: number;
  substrateType: number;
  systemType: number;
  warrantyYears: string;
  warrantyProvider: number;
  homeownerName: string;
  teamMembers: Array<{
    subcontractorID: number;
    memberType: number;
    memberLoginDetails: number;
  }>;
}

export const createProjectPayload = (formData: FormData): ProjectPayload => {
  return {
    action: "saveNewProject",
    address1: cleanAddress(formData.addressLine1),
    address2: cleanAddress(formData.addressLine2),
    address3: cleanAddress(formData.city),
    postCode: formData.postCode,
    startDate: formData.startDate,
    accreditedProject: formData.pasRole === "Yes" ? 1 : 0,
    buildType: mapBuildTypeToId(formData.buildType),
    substrateType: mapSubstrateToId(formData.substrate),
    systemType: mapSystemToId(formData.system),
    warrantyYears: formData.warrantyPeriod,
    warrantyProvider: mapWarrantyProviderToId(formData.warrantyProvider),
    homeownerName: formData.occupierName,
    teamMembers: [
      {
        subcontractorID: formData.ownerId,
        memberType: 1,
        memberLoginDetails: 0,
      },
      ...formData.teamMembers.map((member: TeamMember) => ({
        subcontractorID: member.id,
        memberType: 123,
        memberLoginDetails: 0,
      })),
    ],
  };
};
