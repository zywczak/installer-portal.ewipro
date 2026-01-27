import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/app/Header";
import SnackbarAlert from "../../components/common/SnackbarAlert";
import { AuthNotification } from "../../types/auth.types";

interface DesktopLayoutProps {
  children: React.ReactNode;
  projectAddress: string | null;
  subcontractorName: string | null;
  isProjectView: boolean;
  isSubcontractorView: boolean;
  hasUnreadNotifications: boolean;
  notification: AuthNotification | null;
  sidebarWidth: number;
  onNotificationsClick: (e: React.MouseEvent<HTMLElement>) => void;
  onClearNotification: () => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  projectAddress,
  subcontractorName,
  isProjectView,
  isSubcontractorView,
  hasUnreadNotifications,
  notification,
  sidebarWidth,
  onNotificationsClick,
  onClearNotification,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <Header
        isMobile={false}
        onNotificationsClick={onNotificationsClick}
        hasNewNotifications={hasUnreadNotifications}
        projectAddress={isProjectView ? projectAddress : null}
        subcontractorName={isSubcontractorView ? subcontractorName : null}
      />
      <Box
        sx={{
          flex: 1,
          mt: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": { width: 0, background: "transparent" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
        <SnackbarAlert
          notification={notification} 
          onClose={onClearNotification} 
          sidebarWidth={sidebarWidth}
        />
      </Box>
    </Box>
  );
};

export default DesktopLayout;