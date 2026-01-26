import React from "react";
import { Box } from "@mui/material";
import { ProjectDetails } from "./types";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import Photos from "./photos/Photos";
import EWIProBoard from "./EWIProBoard/EWIProBoard";
import { Documents } from "./document/Documents";
import { DeliveriesList } from "../../common/DeliveriesList";

interface HomeTabContentProps {
  project: ProjectDetails;
  width: number;
  contactId: number;
  projectId: number;
  tabs: Array<{ key: string; label: string; icon: React.JSX.Element }>;
}

const HomeTabContent: React.FC<HomeTabContentProps> = ({
  project,
  width,
  contactId,
  projectId,
  tabs,
}) => {
  const isMobile = width <= 768;
  const hasChatTab = tabs.some((t) => t.key === "chat");
  const hasDocsTab = tabs.some((t) => t.key === "documents");
  const hasDelivTab = tabs.some((t) => t.key === "deliveries");

  return (
    <>
      <ProjectHeader
        installer={project.owner?.name ?? ""}
        startDate={project.projectStartDate}
        finishDate={project.projectFinishDate}
        currentStage={project.projectStage}
        stagingSystemID={project.stagingSystemID}
        projectCode={project.projectCode}
        address1={project.address1}
        address2={project.address2}
        address3={project.address3}
        postcode={project.postcode}
        access_type_name={project.access_type_name}
        ownerAvatar={project.owner?.avatar}
        ownerId={project.owner?.installerID}
        projectMembers={(project.projectMembers ?? []).map((m) => ({
          id: m.memberID,
          name: m.name,
          avatar: m.avatar ? String(m.avatar) : null,
          userID: m.userID,
        }))}
        projectMaxStage={project.projectMaxStage}
        projectStatusName={project.projectStatusName}
        approvedWarranty={project.projectWarranty?.approved?.[0] || null}
        projectWarranty={project.projectWarranty ? {
          approved: project.projectWarranty.approved?.[0] || null,
          others: project.projectWarranty.others
        } : null}
      />

      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        flexWrap="wrap"
        gap={2}
        mt={2}
      >
        <Box
          flex={isMobile ? "1 1 100%" : "1 1 400px"}
          minWidth={isMobile ? "100%" : 400}
          height={hasChatTab ? "auto" : "600px"}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Photos
            projectId={project.id}
            contactId={Number(contactId)}
            isProjectClosed={project.projectStatusName === "Closed"}
            sideBySideWithChat={!hasChatTab}
          />
        </Box>

        {!hasChatTab && (
          <Box
            flex={isMobile ? "1 1 100%" : "1 1 500px"}
            minWidth={isMobile ? "100%" : 500}
            height={isMobile ? "auto" : "600px"}
            sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 2 }}
          >
            <EWIProBoard projectId={projectId} />
          </Box>
        )}

        {!hasDocsTab && (
          <Box
            flex={isMobile ? "1 1 100%" : "1 1 400px"}
            minWidth={isMobile ? "100%" : 400}
            height={hasChatTab ? "auto" : "552px"}
          >
            <Documents projectId={project.id} />
          </Box>
        )}

        {!hasDelivTab && (
          <Box mt={2} width="100%">
            <DeliveriesList deliveries={project.deliveries ?? []} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default HomeTabContent;