import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";

import DataTable, { Column } from "../common/Table/DataTable";
import CardList from "../common/List/CardList";
import { fallbackColors, stageColors } from "../common/colors";
import warranty from "../../assets/warranty.png";
import AcceptButton from "../common/AcceptButton";
import FormTextField from "../common/FormTextField";

interface SubcontractorInfo {
  name: string;
  email: string;
  mobile: string;
  companyName?: string;
  isRegistered: boolean;
}

interface SubcontractorPermission {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface Project {
  id: string;
  contactID: string;
  projectCode: string;
  address: {
    postcode: string;
    rest: string;
    full: string;
  };
  stage: string;
  status: "Open" | "Closed";
  accessType: string;
  totalValue?: string;
  myValue?: string;
  isOwner: boolean;
  isWarranty: boolean;
  members: { installerID: string; name: string; avatar: string | null }[];
}

interface SubcontractorProps {
  subcontractorId: string;
  onNameChange?: (name: string | null) => void;
}

const ALL_PERMISSIONS: Omit<SubcontractorPermission, "enabled">[] = [
  { key: "ownershipTransfer", label: "Ownership transfer", description: "This user will be allowed to create a project for you and make you an Owner of it." },
  { key: "newEntriesInSubcontractors", label: "New entries in Subcontractors", description: "If you enable this option the user will be able to create new entries in your subcontractors list." },
  { key: "canManageTeamMembers", label: "Can manage Team Members", description: "If you enable this option the user will be able to add/remove team members to the projects here he is a Team Member to make it simpler for you." },
  { key: "submitStages", label: "Submit stages", description: "The user will be able to submit stages in your projects where he is added as a team member" },
  { key: "projectDocumentsAccess", label: "Project documents access", description: "User will have access to see and download documents in your projects where he is added as a team member." },
  { key: "projectChatAccess", label: "Project Chat access", description: "If you enable this option this user will have access to see and post into the chats on your projects where he is added as a team member." },
];

const Subcontractor: React.FC<SubcontractorProps> = ({ subcontractorId, onNameChange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<SubcontractorInfo | null>(null);
  const [permissions, setPermissions] = useState<SubcontractorPermission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<string>("info");

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(1200);

  const userID = subcontractorId;

  // ResizeObserver
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

  // LOAD PROJECTS + SUBCONTRACTOR INFO
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access");

      const res = await axios.post(
        "https://api-veen-e.ewipro.com/installer/info/",
        { action: "getProjectsList", filters: [], sort: "projectIDDESC" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allProjects = Array.isArray(res.data?.projects) ? res.data.projects : [];

      // MOCK subcontractor info
      setInfo({
        name: "Jan Kowalski",
        email: "email@example.com",
        mobile: "07123416788",
        companyName: "Firma Testowa",
        isRegistered: true,
      });

      // FILTER PROJECTS BY OWNER OR MEMBER
     const userID = localStorage.getItem("userID") || "";

const filtered = allProjects.filter((item: any) => {
  const isOwner = item.owner?.installerID?.toString() === userID;

  // Sprawdzenie czy subcontractorId jest w members
  const members = Array.isArray(item.members) ? item.members : [];
  const isMember = members.some(
    (m: any) =>
      m.installerID?.toString() === subcontractorId ||
      m.userID?.toString() === subcontractorId ||
      m.memberID?.toString() === subcontractorId
  );

  return isOwner && isMember;
});

      // MAP TO PROJECT FORMAT
      const mapped: Project[] = filtered.map((item: any) => {
        const postcode = item.postcode || "";
        const fullAddress = `${item.address1 || ""} ${item.address2 || ""} ${item.address3 || ""}`.trim();
        const isOwner = item.owner?.installerID?.toString() === subcontractorId;
        const isWarranty = item.type_name === "Warranty";

        const members: Project["members"] = [];

        if (item.owner) {
          members.push({
            installerID: item.owner.installerID?.toString() || "",
            name: item.owner.name || "",
            avatar: item.owner.avatar || null,
          });
        }

        if (Array.isArray(item.members)) {
          members.push(
            ...item.members.map((m: any) => ({
              installerID: m.userID?.toString() || m.memberID?.toString() || "",
              name: m.name || "",
              avatar: m.avatar || null,
            }))
          );
        }

        return {
          id: item.id?.toString() || "-",
          contactID: item.contactID?.toString() || "",
          projectCode: item.projectCode || "-",
          address: {
            postcode,
            full: `${postcode} ${fullAddress}`,
            rest: fullAddress,
          },
          stage:
            item.projectStage && item.projectMaxStage
              ? `${Math.min(item.projectStage, item.projectMaxStage)}/${item.projectMaxStage}`
              : "-",
          status: item.projectStatusName === "Closed" ? "Closed" : "Open",
          accessType: isOwner ? "Owner" : "Member",
          totalValue: item.projectValue ? `£${item.projectValue}` : "---",
          myValue: item.myProjectValue ? `£${item.myProjectValue}` : "£0.00",
          isOwner,
          isWarranty,
          members,
        };
      });

      setProjects(mapped);
      setPermissions(ALL_PERMISSIONS.map((p) => ({ ...p, enabled: true })));

    } catch (err) {
      console.error(err);
      setError("Błąd pobierania danych.");
    } finally {
      setLoading(false);
    }
  }, [subcontractorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Przekazywanie nazwy do rodzica tylko gdy NIE jesteśmy na zakładce "info"
  useEffect(() => {
    if (onNameChange && info) {
      if (activeTab !== "info") {
        onNameChange(info.name);
      } else {
        onNameChange(null);
      }
    }
    
    return () => {
      if (onNameChange) {
        onNameChange(null);
      }
    };
  }, [activeTab, info, onNameChange]);

  const handleTogglePermission = (key: string, enabled: boolean) => {
    setPermissions((prev) => prev.map((p) => (p.key === key ? { ...p, enabled } : p)));
  };

  // TABLE COLUMNS — SAME AS Projects.tsx
  const columns: Column<Project>[] = [
    {
      key: "projectCode",
      label: "Project",
      align: "left",
      render: (p) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>{p.projectCode}</Typography>
          {p.isWarranty && <img src={warranty} style={{ width: 20, height: 20 }} />}
        </Box>
      ),
    },
    {
      key: "address",
      label: "Address",
      align: "left",
      render: (p) => (
        <span>
          <b>{p.address.postcode},</b> {p.address.rest}
        </span>
      ),
    },
    {
      key: "stage",
      label: "Stage",
      align: "center",
      render: (p) => {
        const [current] = p.stage.split("/").map(Number);
        const c = stageColors[current] || fallbackColors;

        return (
          <Box
            sx={{
              padding: "4px 10px",
              borderRadius: "16px",
              backgroundColor: c.bg,
              border: `1px solid ${c.border}`,
              color: c.color,
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            {p.stage}
          </Box>
        );
      },
    },
    { key: "accessType", label: "Access", align: "center" },
  ];

  // RENDER CONTENT
  const renderProjects = () => {
    if (projects.length === 0)
      return <Typography color="text.secondary">Brak projektów.</Typography>;

    if (isMobile)
      return (
        <CardList
          items={projects.map((p) => ({
            id: p.id,
            title: p.projectCode,
            postcode: p.address.postcode,
            subtitle: p.address.rest,
            details: {
              Stage: p.stage,
              Access: p.accessType,
              "Total Value": p.totalValue,
              "My Value": p.myValue,
            },
            status: p.status,
            contactID: p.contactID,
            members: p.members,
            isOwner: p.isOwner,
            isWarranty: p.isWarranty,
          }))}
          type="project"
          onItemClick={(item) => {
            window.location.hash = `projects/${item.id}/${item.contactID}`;
          }}
        />
      );

    return (
      <DataTable
        columns={columns}
        rows={projects}
        rowKey={(row) => row.id}
        type="project"
        onRowClick={(row) => {
          window.location.hash = `projects/${row.id}/${row.contactID}`;
        }}
      />
    );
  };

  const renderContent = () => {
    if (loading)
      return (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      );

    if (error)
      return (
        <Box textAlign="center" py={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      );

    if (!info) return null;

    switch (activeTab) {
      case "info":
  return (
    <Card
      sx={{
        border: "1px solid #e0e0e0",
        p: 3,
        width: "100%",
        mx: "auto",
        borderRadius: 2,
        boxSizing: "border-box",
      }}
    >
      <Box
             sx={{
              pt: 0,
              display: "flex",
               flexDirection: "column",
               alignItems: "center",
              maxWidth: 420,
              mx: "auto",
             }}
           >
        <Stack spacing={5} sx={{ width: "100%" }}>
          <FormTextField
            value={info?.name || ""}
            onChange={() => {}}
            placeholder="Imię i nazwisko"
            size="small"
          />
          <FormTextField
            value={info?.email || ""}
            onChange={() => {}}
            placeholder="Login / e-mail"
            disabled
            size="small"
          />
          <FormTextField
            value={info?.mobile || ""}
            onChange={() => {}}
            placeholder="Numer telefonu"
            size="small"
          />
          <FormTextField
            value={info?.companyName || ""}
            onChange={() => {}}
            placeholder="Nazwa firmy"
            size="small"
          />
        </Stack>

        <Box sx={{ width: "100%", mt: 4 }}>
          <Box sx={{ "& > *": { width: "100%" } }}>
            <AcceptButton
              onClick={() => {}}
              loading={false}
              label="Zapisz"
              loadingLabel="Zapisywanie..."
              disabled={true}
              size="small"
            />
          </Box>
        </Box>
      </Box>
    </Card>
  );

     case "projects":
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Box
        sx={{
          flex: 1,             // zajmuje całą dostępną wysokość
          overflowY: "auto",   // przewijalne tylko treści listy
        }}
      >
        {renderProjects()}
      </Box>
    </Box>
  );


      case "permissions":
        return (
           <Card
      sx={{
        border: '1px solid #e0e0e0',
        p: 2,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        borderRadius: 2,
      }}
    >
      <List disablePadding sx={{ width: '100%', maxWidth: '800px', m: 'auto' }}>

           {permissions.map((p, index) => (
  <React.Fragment key={p.key}>
    <ListItem
    sx={{ py: 2}}
      secondaryAction={
        <Switch
          checked={p.enabled}
          onChange={(e) => handleTogglePermission(p.key, e.target.checked)}
          color="success"
        />
      }
    >
      <FormControlLabel
        control={<Box />}
        label={
          <Box>
            <Typography fontWeight="bold">{p.label}</Typography>
            <Typography variant="body2" color="text.secondary">{p.description}</Typography>
          </Box>
        }
      />
    </ListItem>
    {index < permissions.length - 1 && <Divider />}
  </React.Fragment>
))}


          </List>
    </Card>
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
          overflowY: "auto",
          px: activeTab === "projects" ? 0 : 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {renderContent()}
      </Box>
<Box sx={{ borderTop: "1px solid #ddd", backgroundColor: "background.paper" }}>
      <BottomNavigation
        showLabels
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
      >
        <BottomNavigationAction label="Info" value="info" icon={<PersonIcon />} />
        <BottomNavigationAction label="Projects" value="projects" icon={<FolderIcon />} />
        <BottomNavigationAction label="Permissions" value="permissions" icon={<SecurityIcon />} />
      </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Subcontractor;
