import React from "react";
import { Box, Typography } from "@mui/material";
import ProjectAvatars from "./ProjectAvatars";
import { useWrapDetection } from "./useWrapDetection";
import { Address } from "../../../common/address";
import ApprovedWarrantyBox from "./ApprovedWarrantyBox";
import StageBar from "../StageBar/StageBar";
import AcceptButton from "../../../common/AcceptButton";

interface Member {
  id: number;
  name: string;
  avatar?: string | null;
  userID?: number;
}

interface ApprovedWarranty {
  number: string;
  warrantyType: number;
  period: number;
  status: string;
  downloadURI?: string;
}

interface ProjectWarranty {
  approved: ApprovedWarranty | null;
  others: {
    status: string;
    // ...other fields...
  }[];
}

interface ProjectHeaderProps {
  installer?: string;

  startDate?: string;
  finishDate?: string;

  currentStage: number;
  stagingSystemID: number;

  projectCode?: string;

  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;

  access_type_name?: string;

  ownerAvatar?: string;
  ownerId?: number;

  projectMembers?: Member[];

  projectMaxStage?: number;
  projectStatusName?: string;

  approvedWarranty?: ApprovedWarranty | null;
  projectWarranty?: ProjectWarranty | null;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  installer,
  startDate,
  finishDate,

  currentStage,
  stagingSystemID,
  projectCode,

  address1,
  address2,
  address3,
  postcode,

  access_type_name,

  ownerAvatar,
  ownerId,
  projectMembers = [],

  projectMaxStage,
  projectStatusName,

  approvedWarranty,
  projectWarranty,
}) => {
  const projectAddress = [address1, address2, address3, postcode]
    .filter(Boolean)
    .join(", ");

  const { containerRef, isWrapped } = useWrapDetection();

  const rejectedWarrantiesCount =
    projectWarranty?.others?.filter((w) => w.status === "Rejected").length || 0;

  const hasApprovedWarranty =
    approvedWarranty?.status === "Approved" ||
    projectWarranty?.approved?.status === "Approved";

  const canApplyForWarranty =
    !hasApprovedWarranty &&
    typeof projectMaxStage === "number" &&
    typeof currentStage === "number" &&
    currentStage >= projectMaxStage;

  const showWarrantyButton = canApplyForWarranty;
  const warrantyButtonText =
    rejectedWarrantiesCount > 0 ? "REAPPLY FOR WARRANTY" : "APPLY FOR WARRANTY";

  const avatars = (
    <ProjectAvatars
      ownerId={ownerId}
      ownerAvatar={ownerAvatar}
      ownerName={installer}
      members={projectMembers}
    />
  );

  const warrantyToDisplay = approvedWarranty || projectWarranty?.approved;

  return (
    <Box p={3} pb={0} pt={2} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
      {warrantyToDisplay?.status === "Approved" ? (
        <>
          <Address addr={projectAddress} />

          <Box
            ref={containerRef}
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent={isWrapped ? "center" : "space-between"}
            gap={2}
            mt={2}
            mb={2}
          >
            {avatars}
            <ApprovedWarrantyBox approvedWarranty={warrantyToDisplay} />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          mb={2}
        >
          <Address addr={projectAddress} />
          {avatars}
        </Box>
      )}

      <StageBar
        currentStage={currentStage}
        stagingSystemID={stagingSystemID}
        projectMaxStage={projectMaxStage}
        projectStatusName={projectStatusName}
      />

      {showWarrantyButton && (
  <Box display="flex" justifyContent="center" mt={3} mb={2}>
    <AcceptButton
      label={warrantyButtonText}
      onClick={() => {}}//handleWarrantyClick
      size="medium"
    />
  </Box>
)}


      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        pb={1}
        gap={2}
      >
        <Box width={50} height="1px" bgcolor="#b0b0b0" />
        <Typography variant="caption" color="text.secondary">
          Project ID: {projectCode}
        </Typography>
        <Box width={50} height="1px" bgcolor="#b0b0b0" />
      </Box>
    </Box>
  );
};

export default ProjectHeader;
