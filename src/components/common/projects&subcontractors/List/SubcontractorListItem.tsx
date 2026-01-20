import React from "react";
import { Box, Typography } from "@mui/material";
import UserAvatar from "../../UserAvatar";

interface SubcontractorListItemProps {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: "verified" | "not_registered" | "invited";
  avatar?: string | null;
  onClick?: () => void;
}

const statusColors: Record<string, string> = {
  verified: "#54A852",
  invited: "#fbc02d",
  not_registered: "#9b9b9b",
};

const SubcontractorListItem: React.FC<SubcontractorListItemProps> = ({
  name,
  company,
  email,
  phone,
  status,
  avatar,
  onClick,
}) => {
  const borderColor = status ? statusColors[status] || "#ccc" : "#ccc";

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "8px",
        p: 2,
        border: "1px solid #ddd",
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        cursor: onClick ? "pointer" : "default",
        "&:hover": { boxShadow: "0px 3px 10px rgba(0,0,0,0.1)" },
      }}
    >
      <Box sx={{ mr: 3, flexShrink: 0 }}>
        <UserAvatar avatarUrl={avatar || undefined} size={64} onClick={onClick} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2, color: "#000", mb: 0.5, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, mb: 1, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
          {company || "-"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666", fontSize: "0.875rem", mb: 0.2, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
          {email}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666", fontSize: "0.875rem", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
          {phone}
        </Typography>
      </Box>
    </Box>
  );
};

export default SubcontractorListItem;
