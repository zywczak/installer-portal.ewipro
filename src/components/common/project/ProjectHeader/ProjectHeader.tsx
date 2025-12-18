import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ProjectAvatars from "./ProjectAvatars";
import { useWrapDetection } from "./useWrapDetection";
import { Address } from "../../address";
import ApprovedWarrantyBox from "./ApprovedWarrantyBox";
import StageBar from "./StageBar/StageBar";

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
}) => {
  const projectAddress = [address1, address2, address3, postcode]
    .filter(Boolean)
    .join(", ");

  const { containerRef, isWrapped } = useWrapDetection();

  const showApplyButton =
    !approvedWarranty &&
    projectMaxStage !== undefined &&
    currentStage > projectMaxStage;

  const avatars = (
    <ProjectAvatars
      ownerId={ownerId}
      ownerAvatar={ownerAvatar}
      ownerName={installer}
      members={projectMembers}
    />
  );

  return (
    <Box p={3} pb={0} pt={2} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">

      {/* ADDRESS + AVATARS */}
      {!approvedWarranty || approvedWarranty.status !== "Approved" ? (
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
      ) : (
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
            <ApprovedWarrantyBox approvedWarranty={approvedWarranty} />
          </Box>
        </>
      )}

      {/* STAGE BAR */}
      <StageBar
        currentStage={currentStage}
        stagingSystemID={stagingSystemID}
        projectMaxStage={projectMaxStage}
        projectStatusName={projectStatusName}
      />

      {/* APPLY BUTTON */}
      {showApplyButton && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "#388E3C" },
            }}
          >
            APPLY FOR WARRANTY
          </Button>
        </Box>
      )}

      {/* PROJECT ID */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={1}
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
