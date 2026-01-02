import React, { useState, useEffect, useRef, JSX } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import ListAltIcon from "@mui/icons-material/ListAlt";
import api from "../../api/axiosApi";

import ProjectHeader from "../common/project/ProjectHeader/ProjectHeader";
import { Documents } from "../common/project/document/Documents";
import { DeliveriesList } from "../common/DeliveriesList";
import EWIProBoard from "../common/EWIProBoard/EWIProBoard";
import { Orders } from "../common/Orders";
import BottomTabs, { TabItem } from "../common/BottomTabs";
import Photos from "../common/project/photos/Photos";

interface ProjectProps {
  projectId: string;
  contactId: string;
  onAddressChange?: (addr: string | null) => void;
}

interface WarrantyFile {
  name: string;
  url: string;
  date: string;
}

interface ProjectMember {
  memberID: number;
  name: string;
  avatar?: string | null | false;
  userID?: number;
}

interface ProjectDetails {
  id: number;
  projectCode: string;
  projectStatusName: string;
  projectStatusColor: string;
  access_type_name: string;
  projectStartDate: string;
  projectFinishDate: string;
  projectStage: number;
  projectMaxStage: number;
  stagingSystemID: number;

  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;

  owner: {
    installerID: number;
    name: string;
    companyName: string;
    email: string;
    mobile: string;
    avatar?: string;
  };

  projectWarranty: {
    approved?: {
      number: string;
      warrantyType: number;
      period: number;
      status: string;
      downloadURI?: string;
    };
    others: WarrantyFile[];
  } | null;

  deliveries: any[];
  projectMembers: ProjectMember[];
}

const Project: React.FC<ProjectProps> = ({ projectId, contactId, onAddressChange }) => {
  // ---- HOOKS: ALWAYS AT TOP ----
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(1200);

  const [activeTab, setActiveTab] = useState<string>("home");

  // ResizeObserver — ALWAYS RUNS, NEVER CONDITIONAL
  useEffect(() => {
    if (!containerRef.current) return;

    const obs = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setWidth(rect.width);
    });

    obs.observe(containerRef.current);

    return () => obs.disconnect();
  }, []);

  const isMobile = width <= 768;

  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      const res = await api.post({
        action: "getProjectDetails",
        projectID: projectId,
      });

      if (res.data?.status && res.data?.result) {
        setProject(res.data.result);
      } else {
        setError("Nie udało się pobrać danych projektu.");
      }
      
    } catch (err: any) {
      console.error(err);
      setError("Błąd pobierania projektu.");
    } finally {
      setLoading(false);
    }
  };

  load();
}, [projectId]);

  useEffect(() => {
    if (onAddressChange && project && activeTab !== "home") {
      const addr = [project.address1, project.address2, project.address3, project.postcode]
        .filter(Boolean)
        .join(", ");
      onAddressChange(addr || null);
    } else if (onAddressChange && activeTab === "home") {
      onAddressChange(null);
    }
  }, [project, activeTab, onAddressChange]);

  let tabs: Array<{ key: string; label: string; icon: JSX.Element }> = [];

  if (width > 1390) {
    tabs = [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  } else if (width > 1000) {
    tabs = [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
      { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  } else {
    tabs = [
      { key: "home", label: "Home", icon: <HomeIcon /> },
      { key: "chat", label: "Chat", icon: <ChatIcon /> },
      { key: "documents", label: "Documents", icon: <DescriptionIcon /> },
      { key: "deliveries", label: "Deliveries", icon: <ListAltIcon /> },
      { key: "orders", label: "Orders", icon: <ListAltIcon /> },
    ];
  }

  const hasChatTab = tabs.some((t) => t.key === "chat");
  const hasDocsTab = tabs.some((t) => t.key === "documents");
  const hasDelivTab = tabs.some((t) => t.key === "deliveries");

  const renderContent = () => {
    if (loading)
      return (
        <Box textAlign="center" py={4}>
          <CircularProgress />
          <Typography>Ładowanie...</Typography>
        </Box>
      );

    if (error)
      return (
        <Box textAlign="center" py={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      );

    if (!project)
      return (
        <Box textAlign="center" py={4}>
          <Typography>Projekt nie został znaleziony.</Typography>
        </Box>
      );

    switch (activeTab) {
      case "home":
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
              approvedWarranty={project.projectWarranty?.approved || null}
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
                  flexDirection: "column"
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

      case "chat":
        return (
            <EWIProBoard projectId={projectId} />
        );

      case "documents":
        return (
            <Documents projectId={project.id} />
        );

      case "deliveries":
        return (
            <DeliveriesList deliveries={project.deliveries ?? []} />
        );

      case "orders":
        return (
            <Orders projectID={project.id} contactID={Number(contactId)} />
        );
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" ref={containerRef}>
      <Box
        flex={1}
        sx={{
          overflowY: "auto",
          px: 2,
          pt: 1,
          pb: 1,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {renderContent()}
      </Box>

      <BottomTabs
        value={activeTab}
        tabs={tabs}
        onChange={setActiveTab}
      />
    </Box>
  );
};

export default Project;