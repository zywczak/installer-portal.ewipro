import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, CircularProgress, Tooltip } from "@mui/material";
import DataTable, { Column } from "../common/Table/DataTable";
import axios from "axios";
import CardList from "../common/List/CardList";
import warranty from '../../assets/warranty.png';
import { fallbackColors, stageColors } from "./colors";
import api from "../../api/axiosApi";

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

interface ProjectsProps {
  isMobile: boolean;
}

interface DataRow extends Project {}


const OnGoingProjects: React.FC<ProjectsProps> = ({ isMobile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTiles, setUseTiles] = useState(false);
  const [savedWidth, setSavedWidth] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userID = localStorage.getItem("userID") ?? "";

 const columns: Column<DataRow>[] = [
  {
    key: "projectCode",
    label: "Project",
    align: "left",
    render: (p) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography>{p.projectCode}</Typography>
        {p.isWarranty && (
          <Tooltip title="Gwarancja" arrow>
            <Box sx={{ width: 20, height: 20 }}>
              <img src={warranty} alt="Warranty" style={{ width: "100%", height: "100%" }} />
            </Box>
          </Tooltip>
        )}
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
    )
  },
  {
    key: "stage",
    label: "Stage",
    align: "center",
    render: (p) => {
      const [current] = p.stage.split("/").map(Number);
      
      const color = stageColors[current] || fallbackColors;

      return (
          <Box
            sx={{
              padding: "4px 10px",
              borderRadius: "16px",
              backgroundColor: color.bg,
              border: `1px solid ${color.border}`,
              color: color.color,
              fontWeight: 600,
              fontSize: "0.85rem",
              minWidth: 48,
              textAlign: "center",
            }}
          >
            {p.stage}
          </Box>
      );
    },
  },
  { key: "accessType", label: "Access", align: "center" },
{
  key: "members",
  label: "Members",
  render: (p) => {
    const maxVisible = 3;
    const visibleMembers = p.members.slice(0, maxVisible);
    const extraCount = p.members.length - maxVisible;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          maxWidth: 200,
        }}
      >
        {visibleMembers.map((m) => {
          const initials =
            (m.name?.split(" ")[1]?.[0] ?? m.name?.[0] ?? "?") +
            (m.name?.split(" ")[0]?.[0] ?? "");
          const avatarSrc =
            m.avatar && m.avatar !== "" && m.avatar !== "null" ? m.avatar : null;

          return (
            <Tooltip key={m.installerID} title={m.name || ""} arrow>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#d0d0d0",
                  border: "1px solid #ccc",
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  userSelect: "none",
                }}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  initials
                )}
              </Box>
            </Tooltip>
          );
        })}
        {extraCount > 0 && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "#d0d0d0",
              border: "1px solid #ccc",
              color: "#333",
              fontSize: "13px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
          >
            +{extraCount}
          </Box>
        )}
      </Box>
    );
  },
}
,];



  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post({
        action: "getProjectsList",
        filters: [{ ongoingOnly: true }],
        sort: "projectIDDESC",
      });

        const data = Array.isArray(res.data?.projects) ? res.data.projects : [];
        const mapped: Project[] = data.map((item: any) => {
  const postcode = item.postcode || "";
  const fullAddress = `${item.address1 || ""} ${item.address2 || ""} ${item.address3 || ""}`.trim();
  const isOwner = item.owner?.installerID?.toString() === userID;
  const isWarranty = item.type_name === "Warranty";
  const membersList: Project["members"] = [];

  if (item.owner) {
    membersList.push({
      installerID: item.owner.installerID?.toString() || "",
      name: item.owner.name || "",
      avatar: item.owner.avatar || null,
    });
  }

  if (Array.isArray(item.members)) {
    membersList.push(
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
      full: `${postcode} ${fullAddress}`.trim(),
      rest: fullAddress,
    },
    stage:
      item.projectStage && item.projectMaxStage
        ? `${Math.min(item.projectStage, item.projectMaxStage)}/${item.projectMaxStage}`
        : "-",
    status: item.projectStatusName === "Closed" ? "Closed" : "Open",
    accessType: isOwner ? "Owner" : "Member",
    totalValue: item.projectValue && item.projectValue !== false ? `£${item.projectValue}` : "---",
    myValue: item.myProjectValue ? `£${item.myProjectValue}` : "£0.00",
    isOwner,
    isWarranty,
    members: membersList,
  };
});


        setProjects(mapped);
      } catch (err: any) {
        console.error("❌ Błąd pobierania projektów:", err);
        setError(err.response?.data?.message || "Nie udało się pobrać listy projektów.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleTableOverflow = (isOverflowing: boolean) => {
    if (isOverflowing) {
      setUseTiles(true);
      if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
    }
  };

  const handleRowClick = (row: DataRow) => {
    window.location.hash = `projects/${row.id}/${row.contactID}`;
  };

  const rowStatusColor = {
  Open: "#54A852",
  Closed: "#e91e63",
};

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (useTiles && savedWidth !== null && width >= savedWidth + 1) {
          setUseTiles(false);
          setSavedWidth(null);
        }
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.unobserve(el);
      resizeObserver.disconnect();
    };
  }, [useTiles, savedWidth]);

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

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>
      {projects.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">Nie znaleziono żadnych danych.</Typography>
        </Box>
      ) : (
          <>
    
        {isMobile || useTiles ? (
          
        <CardList
  items={projects.map(p => ({
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
  stickyFooter={false} 
/>
      ) : (
        <DataTable
              columns={columns}
              rows={projects}
              rowKey={(row) => row.id}
              onRowClick={handleRowClick}

              getRowStatusColor={(row) => rowStatusColor[row.status]}
              type={"project"}
              stickyFooter={false}
          />
        )}
      </>
    )}
    </Box>
  );
};

export default OnGoingProjects;
