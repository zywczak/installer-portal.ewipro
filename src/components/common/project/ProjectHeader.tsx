import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import StageBar from "./StageBar";
import UserAvatar from "../../common/UserAvatar";
import { Address } from "../address";
import ApprovedWarrantyBox from "./ApprovedWarrantyBox";

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
  installer: string;
  startDate: string;
  finishDate: string;
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
  ownerAvatar,
  ownerId,
  projectMembers = [],
  projectMaxStage,
  projectStatusName,
  approvedWarranty,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isWrapped, setIsWrapped] = useState(false);

  const projectAddress = [address1, address2, address3, postcode].filter(Boolean).join(", ");

  useEffect(() => {
    function checkWrap() {
      const container = containerRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      const firstTop = (children[0] as HTMLElement)?.offsetTop || 0;
      const wrapped = children.some((child) => (child as HTMLElement).offsetTop > firstTop);
      setIsWrapped(wrapped);
    }

    checkWrap();
    window.addEventListener("resize", checkWrap);
    return () => window.removeEventListener("resize", checkWrap);
  }, []);

  const showApplyButton =
    (!approvedWarranty) &&
    projectMaxStage !== undefined &&
    currentStage > projectMaxStage;

  const fullAddress = [address1, address2, address3].filter(Boolean).join(", ");

  return (
    <Box p={3} mt={1} pb={0} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">

      {/* Adres i awatary */}
      {!approvedWarranty || approvedWarranty.status !== "Approved" ? (
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
          <Address addr={projectAddress} />

          <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
            {ownerId && (
              <UserAvatar
                avatarUrl={ownerAvatar}
                size={48}
                tooltip={installer}
                onClick={() => { window.location.hash = `subcontractors/${ownerId}`; }}
              />
            )}

            {projectMembers.map((member) => (
              <UserAvatar
                key={member.id}
                avatarUrl={member.avatar || undefined}
                size={40}
                tooltip={member.name}
                onClick={() => { window.location.hash = `subcontractors/${member.userID || member.id}`; }}
              />
            ))}
          </Box>
        </Box>
      ) : (
        <>
          <Address addr={projectAddress} />

          {/* Avatary + Warranty */}
          <Box
            ref={containerRef}
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            justifyContent={isWrapped ? "center" : "space-between"}
            gap={2}
            mb={2}
          >
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
              {ownerId && (
                <UserAvatar
                  avatarUrl={ownerAvatar}
                  size={48}
                  tooltip={installer}
                  onClick={() => { window.location.hash = `subcontractors/${ownerId}`; }}
                />
              )}
              {projectMembers.map((member) => (
                <UserAvatar
                  key={member.id}
                  avatarUrl={member.avatar || undefined}
                  size={40}
                  tooltip={member.name}
                  onClick={() => { window.location.hash = `subcontractors/${member.userID || member.id}`; }}
                />
              ))}
            </Box>

            {approvedWarranty && approvedWarranty.status === "Approved" && (
              <ApprovedWarrantyBox approvedWarranty={approvedWarranty} />
            )}
          </Box>
        </>
      )}

      {/* Stage Bar */}
      <StageBar
        currentStage={currentStage}
        stagingSystemID={stagingSystemID}
        finishDate={finishDate}
        projectMaxStage={projectMaxStage}
        projectStatusName={projectStatusName}
      />

      {/* Apply for Warranty */}
      {showApplyButton && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '50px',
              padding: '12px 30px',
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#388E3C' }
            }}
            onClick={() => console.log("Applying for warranty...")}
          >
            APPLY FOR WARRANTY
          </Button>
        </Box>
      )}

      {/* Project ID */}
      <Box display="flex" alignItems="center" justifyContent="center" pt={1} pb={1} gap={2}>
        <Box flex="0 1 50px" height="1px" bgcolor="#b0b0b0" />
        <Typography variant="caption" color="text.secondary">
          Project ID: {projectCode}
        </Typography>
        <Box flex="0 1 50px" height="1px" bgcolor="#b0b0b0" />
      </Box>

    </Box>
  );
};

export default ProjectHeader;
