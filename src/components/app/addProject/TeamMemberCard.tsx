import React from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import defaultAvatar from "../../../assets/profile-photo.png";
import { TeamMember } from "./types";
import { useTranslation } from "react-i18next";

interface TeamMemberCardProps {
  member: TeamMember;
  isCurrentUser?: boolean;
  isOwner?: boolean;
  onRemove?: (id: number) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  isCurrentUser = false,
  isOwner = false,
  onRemove
}) => {
    const { t } = useTranslation();

  if (isOwner) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: '16px',
        backgroundColor: isCurrentUser ? 'primary.50' : 'background.paper',
        flex: '1 1 200px',
        minWidth: 200,
        maxWidth: '100%',
        '&:hover': { boxShadow: 1 },
      }}
    >
      <Avatar
        src={member.avatarUrl || defaultAvatar}
        sx={{ width: 48, height: 48, mr: 2, bgcolor: 'transparent', flexShrink: 0 }}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          fontWeight={500}
          color="text.primary"
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {member.name}
          {isCurrentUser && (
            <Typography component="span" variant="body1" sx={{ color: 'text.secondary', ml: 1 }}>
              ({t('views.newProject.TeamMembers.me')})
            </Typography>
          )}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {member.email || member.role}
        </Typography>
      </Box>
      {!isCurrentUser && onRemove && (
        <IconButton size="small" onClick={() => onRemove(member.id)} sx={{ ml: 1, flexShrink: 0 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};
