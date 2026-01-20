import React, { useState, useEffect } from "react";
import { Box, Drawer } from "@mui/material";
import Header from "../components/app/Header";
import Sidebar from "../components/app/sidebar/Sidebar";
import Subcontractors from "../components/app/Subcontractors";
import Projects from "../components/app/Projects";
import Dashboard from "../components/app/Dashboard/Dashboard";
import Settings from "../components/app/settings/Settings";
import i18n from "../i18n";
import ChangePassword from "../components/app/ChangePassword";
import Notifications from "../components/app/Notifications/Notifications";
import { Notification } from "../components/app/Notifications/types";
import ProfileView from "../components/app/MyProfile/ProfileView";
import Project from "../components/app/Project";
import AIAssistant from "../components/app/AIAssistant";
import Subcontractor from "../components/app/Subcontractor";
import AddProjectForm from "../components/app/addProject/AddProjectForm";
import OrderCreationPage from "../components/app/OrderCreationPage";
import Calculator from "../components/app/Calculator/Calculator";
import { SnackbarProvider, useAuthNotification } from "../context/AuthContext";
import SnackbarAlert from "../components/common/SnackbarAlert";

const AppContent: React.FC = () => {
  const [language, setLanguage] = React.useState(i18n.language || "en");

  // Synchronizuj i18n z React state
  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };
  const [view, setView] = useState<string>(globalThis.location.hash.replace("#", "") || "dashboard");
  const [viewParam, setViewParam] = useState<string | null>(null);
  const [isMobileContent, setIsMobileContent] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isProjectView = view.startsWith("projects/");
  const isSubcontractorView = view.startsWith("subcontractors/");
  const [projectAddress, setProjectAddress] = useState<string | null>(null);
  const [subcontractorName, setSubcontractorName] = useState<string | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const { notification, clearNotification } = useAuthNotification();

  const [sidebarWidth, setSidebarWidth] = useState(250);

  useEffect(() => {
  const onHashChange = () => {
  const hash = globalThis.location.hash.replace("#", "") || "dashboard";
  setView(hash);

  const parts = hash.split("/");

  if (parts[0] === "projects") {
    setViewParam(parts[1] || null);
  } else if (parts[0] === "subcontractors") {
    setViewParam(parts[1] || null);
  } else {
    setViewParam(null);
  }

  setMobileSidebarOpen(false);
};

    globalThis.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => globalThis.removeEventListener("hashchange", onHashChange);
  }, []);
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch("https://api-veen-e.ewipro.com/installer/info/", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          action: "getUserNotifications",
          limit: 50,
        }),
      });

      if (!res.ok) {
        throw new Error("Network error: " + res.status);
      }

      const data = await res.json();
      console.log("Raw notifications data:", data);

      const mapped = (data?.results || []).map((n: any) => ({
    id: n.id?.toString(),
    title: n.title ?? "Powiadomienie",

    message: n.message ?? "", 
    projectID: n.projectID ?? undefined,
    contactID: n.contactID ?? undefined, 
    slug: n.slug ?? "",

    date: n.date ?? "", 

    read: !(n.unread ?? false), 
}));
      console.log("Fetched notifications:", mapped);
      setNotifications(mapped);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  fetchNotifications();
}, []);

  useEffect(() => {
    const handleResize = () => setIsMobileContent(window.innerWidth < 705);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigateTo = (newView: string) => {
  setView(newView);

  const parts = newView.split("/");

  if (parts[0] === "projects") {
    setViewParam(parts[1] || null);
  } else if (parts[0] === "subcontractors") {
    setViewParam(parts[1] || null);
  } else {
    setViewParam(null);
  }

  globalThis.location.hash = newView;
};



  const renderView = () => {
    if (view.startsWith("projects/") && viewParam) {
const parts = view.split("/");
const projectId = parts[1];
const contactId = parts[2] ?? "";
return (
<Project
  projectId={projectId}
  contactId={contactId}
  onAddressChange={(addr) => setProjectAddress(addr)}
/>
);

}
    if (view.startsWith("subcontractors/") && viewParam) {
      return (
        <Subcontractor 
          subcontractorId={viewParam}
          onNameChange={(name) => setSubcontractorName(name)}
        />
      );
    }

    if (view.startsWith("createOrder/")) {
      const parts = view.split("/");
      const projectId = parts[1];
      const contactId = parts[2];
      return <OrderCreationPage projectId={projectId} contactId={contactId} />;
    }

    const viewMap: Record<string, React.ReactNode> = {
      dashboard: <Dashboard isMobile={isMobileContent} />,
      projects: <Projects isMobile={isMobileContent} />,
      subcontractors: <Subcontractors isMobile={isMobileContent} />,
      settings: <Settings navigateTo={navigateTo} language={language} onLanguageChange={handleLanguageChange} />,
      calculator: <Calculator/>,
      changepassword: (
        <ChangePassword />
      ),
      profile: (
        <ProfileView />
      ),
      addProject: <AddProjectForm />
    };

    return viewMap[view] || <Box>Not found</Box>;
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      <Box sx={{ position: "absolute", right: 16, top: 12, }}>
        <Notifications
          isMobile={isMobileContent} 
          notifications={notifications}
          open={Boolean(anchorEl)}
          drawerOpen={drawerOpen}
          onClose={() => { setDrawerOpen(false); setAnchorEl(null); }}
          anchorEl={anchorEl}
          onUnreadChange={setHasUnreadNotifications}
        />
      </Box>

      {/* Desktop Sidebar - zawsze widoczny */}
      {!isMobileContent && (
        <Sidebar
          navigateTo={navigateTo}
          currentView={view}
          onWidthChange={(width) => setSidebarWidth(width)}
        />
      )}

      {/* Mobile Sidebar - w Drawer, na pełną szerokość */}
      {isMobileContent && mobileSidebarOpen && (
        <Drawer
          anchor="left"
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          slotProps={{ paper: { sx: { width: "100%", height: "100%", background: "transparent" } } }}
        >
          <Sidebar
            navigateTo={navigateTo}
            currentView={view}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </Drawer>
      )}
      {isMobileContent ? (
<Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "hidden" }}>
  <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
    <Header
      isMobile={isMobileContent}
      onNotificationsClick={(e) => {
        if (isMobileContent) setDrawerOpen(true);
        else setAnchorEl((prev) => (prev ? null : e.currentTarget));
      }}
      onMenuClick={() => setMobileSidebarOpen(true)}
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
    {renderView()}

      <SnackbarAlert
      notification={notification} 
      onClose={clearNotification} 
      sidebarWidth={0}
    />

  </Box>
</Box>
) : (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          <Header
            isMobile={isMobileContent}
            onNotificationsClick={(e) => {
              if (isMobileContent) setDrawerOpen(true);
              else setAnchorEl((prev: HTMLElement | null) => (prev ? null : e.currentTarget));
            }}
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
            {renderView()}
            <SnackbarAlert
              notification={notification} 
              onClose={clearNotification} 
              sidebarWidth={sidebarWidth}
            />
          </Box>
        </Box>
      )}
      <AIAssistant />
    </Box>
  );
}

const App: React.FC = () => (
  <SnackbarProvider>
    <AppContent />
  </SnackbarProvider>
);

export default App;
