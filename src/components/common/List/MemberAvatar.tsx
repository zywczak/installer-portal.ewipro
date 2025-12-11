import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";

interface Member {
  installerID: string;
  name: string;
  avatar: string | null;
}

interface MemberAvatarProps {
  member: Member;
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({ member }) => {
  const initials =
    (member.name?.split(" ")[1]?.[0] ?? member.name?.[0] ?? "?") +
    (member.name?.split(" ")[0]?.[0] ?? "");
  const avatarSrc = member.avatar && member.avatar !== "null" ? member.avatar : null;

  return (
    <Tooltip title={member.name} arrow>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#d0d0d0",
          border: "1px solid #ccc",
          fontSize: "10px",
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
          <img src={avatarSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Typography sx={{ lineHeight: 1, fontSize: '0.7rem', fontWeight: 'bold' }}>
            {initials}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default MemberAvatar;
