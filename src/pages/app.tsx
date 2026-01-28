import React from "react";
import { Box, Drawer } from "@mui/material";
import Sidebar from "../components/app/sidebar/Sidebar";
import AIAssistant from "../components/app/AIAssistant/AIAssistant";
import Notifications from "../components/app/Notifications/Notifications";
import { useAuthNotification, SnackbarProvider } from "../context/AuthContext";
import MobileLayout from "./app/mobileLayout";
import DesktopLayout from "./app/desktopLayout";
import { useLanguage } from "./app/useLanguage";
import { useNotifications } from "./app/useNotifications";
import { useResponsive } from "./app/useResponsive";
import { useViewNavigation } from "./app/useViewNavigation";
import ViewRenderer from "./app/viewRenderer";

const AppContent: React.FC = () => {
  const { language, handleLanguageChange } = useLanguage();
  
  const {
    view,
    viewParam,
    projectAddress,
    subcontractorName,
    isProjectView,
    isSubcontractorView,
    setProjectAddress,
    setSubcontractorName,
    navigateTo,
  } = useViewNavigation();

  const {
    isMobileContent,
    mobileSidebarOpen,
    sidebarWidth,
    setMobileSidebarOpen,
    setSidebarWidth,
  } = useResponsive();

  const {
    notifications,
    hasUnreadNotifications,
    anchorEl,
    drawerOpen,
    setHasUnreadNotifications,
    setAnchorEl,
    setDrawerOpen,
  } = useNotifications();

  const { notification, clearNotification } = useAuthNotification();

  const handleNotificationsClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobileContent) {
      setDrawerOpen(true);
    } else {
      setAnchorEl((prev) => (prev ? null : e.currentTarget));
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <Box sx={{ position: "absolute", right: 16, top: 12 }}>
        <Notifications
          isMobile={isMobileContent} 
          notifications={notifications}
          open={Boolean(anchorEl)}
          drawerOpen={drawerOpen}
          onClose={() => { 
            setDrawerOpen(false); 
            setAnchorEl(null); 
          }}
          anchorEl={anchorEl}
          onUnreadChange={setHasUnreadNotifications}
        />
      </Box>

      {/* Desktop Sidebar */}
      {!isMobileContent && (
        <Sidebar
          navigateTo={navigateTo}
          currentView={view}
          onWidthChange={setSidebarWidth}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobileContent && mobileSidebarOpen && (
        <Drawer
          anchor="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          slotProps={{ 
            paper: { 
              sx: { 
                width: "100%", 
                height: "100%", 
                background: "transparent" 
              } 
            } 
          }}
        >
          <Sidebar
            navigateTo={navigateTo}
            currentView={view}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </Drawer>
      )}

      {isMobileContent ? (
        <MobileLayout
          projectAddress={projectAddress}
          subcontractorName={subcontractorName}
          isProjectView={isProjectView}
          isSubcontractorView={isSubcontractorView}
          hasUnreadNotifications={hasUnreadNotifications}
          notification={notification}
          onNotificationsClick={handleNotificationsClick}
          onMenuClick={() => setMobileSidebarOpen(true)}
          onClearNotification={clearNotification}
        >
          <ViewRenderer
            view={view}
            viewParam={viewParam}
            isMobileContent={isMobileContent}
            language={language}
            onLanguageChange={handleLanguageChange}
            onNavigateTo={navigateTo}
            onProjectAddressChange={setProjectAddress}
            onSubcontractorNameChange={setSubcontractorName}
          />
        </MobileLayout>
      ) : (
        <DesktopLayout
          projectAddress={projectAddress}
          subcontractorName={subcontractorName}
          isProjectView={isProjectView}
          isSubcontractorView={isSubcontractorView}
          hasUnreadNotifications={hasUnreadNotifications}
          notification={notification}
          sidebarWidth={sidebarWidth}
          onNotificationsClick={handleNotificationsClick}
          onClearNotification={clearNotification}
        >
          <ViewRenderer
            view={view}
            viewParam={viewParam}
            isMobileContent={isMobileContent}
            language={language}
            onLanguageChange={handleLanguageChange}
            onNavigateTo={navigateTo}
            onProjectAddressChange={setProjectAddress}
            onSubcontractorNameChange={setSubcontractorName}
          />
        </DesktopLayout>
      )}

      <AIAssistant />
    </Box>
  );
};

const App: React.FC = () => (
  <SnackbarProvider>
    <AppContent />
  </SnackbarProvider>
);

export default App;