import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/app/Header";
import SnackbarAlert from "../../components/common/SnackbarAlert";
import { AuthNotification } from "../../types/auth.types";

interface MobileLayoutProps {
  children: React.ReactNode;
  projectAddress: string | null;
  subcontractorName: string | null;
  isProjectView: boolean;
  isSubcontractorView: boolean;
  hasUnreadNotifications: boolean;
  notification: AuthNotification | null;
  onNotificationsClick: (e: React.MouseEvent<HTMLElement>) => void;
  onMenuClick: () => void;
  onClearNotification: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  projectAddress,
  subcontractorName,
  isProjectView,
  isSubcontractorView,
  hasUnreadNotifications,
  notification,
  onNotificationsClick,
  onMenuClick,
  onClearNotification,
}) => {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "hidden" }}>
      <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Header
          isMobile={true}
          onNotificationsClick={onNotificationsClick}
          onMenuClick={onMenuClick}
          hasNewNotifications={hasUnreadNotifications}
          projectAddress={isProjectView ? projectAddress : null}
          subcontractorName={isSubcontractorView ? subcontractorName : null}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          mt: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 0, background: "transparent" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}

        <SnackbarAlert
          notification={notification} 
          onClose={onClearNotification} 
          sidebarWidth={0}
        />
      </Box>
    </Box>
  );
};

export default MobileLayout;