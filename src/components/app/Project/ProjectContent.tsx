import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ProjectDetails } from "./types";
import EWIProBoard from "./EWIProBoard/EWIProBoard";
import { Documents } from "./document/Documents";
import { DeliveriesList } from "../../common/DeliveriesList";
import { Orders } from "../../common/Orders";
import HomeTabContent from "./HomeTabContent";
import EmptyStateBox from "../../common/EmptyStateBox";
import InboxIcon from '@mui/icons-material/Inbox';
import { useTranslation } from "react-i18next";

interface ProjectContentProps {
  loading: boolean;
  error: string | null;
  project: ProjectDetails | null;
  activeTab: string;
  width: number;
  contactId: number;
  projectId: number;
  tabs: Array<{ key: string; label: string; icon: React.JSX.Element }>;
}

const ProjectContent: React.FC<ProjectContentProps> = ({
  loading,
  error,
  project,
  activeTab,
  width,
  contactId,
  projectId,
  tabs,
}) => {
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box textAlign="center" py={4}>
        <EmptyStateBox icon={<InboxIcon />} text={t("views.projectDetails.empty")} isDisabled={true} />
      </Box>
    );
  }

  switch (activeTab) {
    case "home":
      return (
        <HomeTabContent
          project={project}
          width={width}
          contactId={contactId}
          projectId={projectId}
          tabs={tabs}
        />
      );

    case "chat":
      return <EWIProBoard projectId={projectId} />;

    case "documents":
      return <Documents projectId={project.id} />;

    case "deliveries":
      return <DeliveriesList deliveries={project.deliveries ?? []} />;

    case "orders":
      return <Orders projectID={project.id} contactID={Number(contactId)} />;

    default:
      return null;
  }
};

export default ProjectContent;
