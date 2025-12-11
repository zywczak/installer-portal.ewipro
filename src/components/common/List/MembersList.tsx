import React from "react";
import { Box } from "@mui/material";
import MemberAvatar from "./MemberAvatar";

interface Member {
  installerID: string;
  name: string;
  avatar: string | null;
}

interface MembersListProps {
  members: Member[];
}

const MembersList: React.FC<MembersListProps> = ({ members }) => {
  const maxVisible = 3;
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {visibleMembers.map((m) => (
        <MemberAvatar key={m.installerID} member={m} />
      ))}
      {extraCount > 0 && (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "#d0d0d0",
            border: "1px solid #ccc",
            color: "#333",
            fontSize: "10px",
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

export default MembersList;
