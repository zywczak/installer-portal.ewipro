
import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import FolderIcon from "@mui/icons-material/Folder";
import BottomTabs, { TabItem } from "../../common/BottomTabs";
import InfoTab from './InfoTab';
import ProjectsTab from './ProjectsTab';
import PermissionsTab from './PermissionsTab';
import { SubcontractorProps } from './types';
import {
  useSubcontractorData,
  useResponsiveWidth,
  useNameChangeEffect,
} from './hooks';
import { useTranslation } from "react-i18next";

const Subcontractor: React.FC<SubcontractorProps> = ({
  subcontractorId,
  onNameChange,
}) => {
    const { t } = useTranslation();
    
  const [activeTab, setActiveTab] = useState<string>("info");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { containerRef, isMobile } = useResponsiveWidth();
  
  const {
    loading,
    error,
    info,
    permissions,
    projects,
    handleTogglePermission,
  } = useSubcontractorData(subcontractorId);

  useNameChangeEffect(activeTab, info, onNameChange);

  const tabs: TabItem[] = [
    { key: "info", label: t("views.subcontractors.subViews.info.header"), icon: <PersonIcon /> },
    { key: "projects", label: t("views.subcontractors.subViews.projects.header"), icon: <FolderIcon /> },
    { key: "permissions", label: t("views.subcontractors.subViews.permissions.header"), icon: <SecurityIcon /> },
  ];

  const renderContent = () => {
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

    if (!info) return null;

    switch (activeTab) {
      case "info":
        return <InfoTab info={info} subcontractorId={subcontractorId} />;

      case "projects":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "calc(100% + 52px)",
            }}
          >
            <ProjectsTab 
              projects={projects} 
              isMobile={isMobile}
              stickyFooter={true}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </Box>
        );

      case "permissions":
        return (
          <PermissionsTab
            permissions={permissions}
            onToggle={handleTogglePermission}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box ref={containerRef} display="flex" flexDirection="column" height="100%">
      <Box
        sx={{
          flex: 1,
          overflowY: activeTab === "projects" ? "hidden" : "auto",
          px: activeTab === "projects" ? 0 : 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {renderContent()}
      </Box>
      <BottomTabs value={activeTab} tabs={tabs} onChange={setActiveTab} />
    </Box>
  );
};

export default Subcontractor;