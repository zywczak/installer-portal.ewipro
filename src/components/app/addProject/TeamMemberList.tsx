import React from "react";
import { Box, Typography } from "@mui/material";
import { TeamMember } from "./types";
import { TeamMemberCard } from "./TeamMemberCard";
import { useTranslation } from "react-i18next";

interface TeamMemberListProps {
  members: TeamMember[];
  currentUserId?: number;
  ownerId?: number;
  onRemove?: (id: number) => void;
}

export const TeamMemberList: React.FC<TeamMemberListProps> = ({
  members,
  currentUserId,
  ownerId,
  onRemove
}) => {
    const { t } = useTranslation();

  if (members.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
        {t('views.newProject.TeamMembers.noMembers')}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
      {members.map(member => (
        <TeamMemberCard
          key={member.id}
          member={member}
          isCurrentUser={member.id === currentUserId}
          isOwner={member.id === ownerId}
          onRemove={onRemove}
        />
      ))}
    </Box>
  );
};
