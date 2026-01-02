import React from "react";
import { Box, Tooltip } from "@mui/material";
import { Project } from "./types";
import UserAvatar from "../../UserAvatar";

interface Props {
  members: Project["members"];
}

const ProjectMembers: React.FC<Props> = ({ members }) => {
  const maxVisible = 3;
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: 200 }}>
      {visibleMembers.map((m) => {
        return (
          <Tooltip key={m.installerID} title={m.name || ""} arrow>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#d0d0d0",
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
              <UserAvatar avatarUrl={m.avatar || undefined} size={32} />
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
};

export default ProjectMembers;
