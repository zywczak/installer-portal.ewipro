import React from "react";
import { Project } from "./types";
import DataTable, { Column } from "../../common/projects&subcontractors/Table/DataTable";
import ProjectMembers from "./ProjectMembers";
import warranty from '../../../assets/warranty.png';
import { Box, Tooltip, Typography } from "@mui/material";
import { fallbackColors, stageColors } from "../../common/colors";
import { useTranslation } from "react-i18next";

interface Props {
  rows: Project[];
  onRowClick: (row: Project) => void;
  onOverflow: (overflow: boolean) => void;
  stickyFooter?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ProjectsTable: React.FC<Props> = ({ rows, onRowClick, onOverflow, stickyFooter, currentPage, onPageChange }) => {
  const rowStatusColor = { Open: "#54A852", Closed: "#e91e63" };
  const { t } = useTranslation();
  const columns: Column<Project>[] = [
    {
      key: "projectCode",
      label: t("views.MyProjects.table.project"),
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
    { key: "address", label: t("views.MyProjects.table.address"), align: "left", render: (p) => <span><b>{p.address.postcode},</b> {p.address.rest}</span> },
    {
      key: "stage",
      label: t("views.MyProjects.table.stage"),
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
    { key: "accessType", label: t("views.MyProjects.table.access"), align: "center" },
    { key: "members", label: t("views.MyProjects.table.members"), render: (p) => <ProjectMembers members={p.members} /> },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      onRowClick={onRowClick}
      onHorizontalOverflow={onOverflow}
      getRowStatusColor={(row) => rowStatusColor[row.status]}
      type="project"
      stickyFooter={stickyFooter}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
};

export default ProjectsTable;
