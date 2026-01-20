import React from "react";
import { Box, Stack, Typography, Tooltip } from "@mui/material";
import warranty from '../../../assets/warranty.png';
import { fallbackColors, stageColors } from "../../common/colors";
import UserAvatar from "../../common/UserAvatar";

interface Member {
  installerID: string;
  name: string;
  avatar?: string | null;
}

interface ProjectListItemProps {
  postcode?: string;
  subtitle?: string;
  details?: Record<string, string>;
  status?: "Open" | "Closed";
  members?: Member[];
  isOwner?: boolean;
  isWarranty?: boolean;
  onClick?: () => void;
}

const StageBox: React.FC<{ stage: string }> = ({ stage }) => {
  const [current] = stage.split("/").map(Number);
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
        display: "inline-block",
      }}
    >
      {stage}
    </Box>
  );
};

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  postcode,
  subtitle,
  details,
  status,
  members,
  isOwner,
  isWarranty,
  onClick,
}) => {
  let borderLeft: string;

if (status === "Open") {
  borderLeft = "4px solid #54A852";
} else if (status === "Closed") {
  borderLeft = "4px solid #e91e63";
} else {
  borderLeft = "4px solid transparent";
}

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: 2,
        border: "1px solid #ddd",
        borderLeft: borderLeft,
        borderRadius: "8px",
        cursor: onClick ? "pointer" : "default",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        "&:hover": { boxShadow: "0px 3px 10px rgba(0,0,0,0.1)" },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{postcode}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
        </Stack>

        <Stack alignItems="flex-end" spacing={0.5} sx={{ mr: isOwner ? 2 : 1.3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            {isOwner ? "Owner" : "Member"}
          </Typography>
          {isWarranty && (
            <Tooltip title="Gwarancja" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={warranty} alt="Warranty" style={{ width: 24, height: 24 }} />
              </Box>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {members?.slice(0, 3).map((m) => (
            <Tooltip key={m.installerID} title={m.name} arrow>
              <UserAvatar avatarUrl={m.avatar || undefined} size={24} />
            </Tooltip>
          ))}
          {members && members.length > 3 && (
            <Box sx={{
              width: 24, height: 24, borderRadius: "50%",
              backgroundColor: "#d0d0d0", border: "1px solid #ccc",
              fontSize: "10px", fontWeight: "bold",
              display: "flex", alignItems: "center", justifyContent: "center",
              userSelect: "none",
            }}>+{members.length - 3}</Box>
          )}
        </Box>

        <StageBox stage={details?.Stage ?? "-"} />
      </Stack>
    </Box>
  );
};

export default ProjectListItem;
