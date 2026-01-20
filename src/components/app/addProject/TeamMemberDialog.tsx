import React from "react";
import { Box, CircularProgress, Paper, TextField, IconButton, Checkbox, Avatar, Typography, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import defaultAvatar from "../../../assets/profile-photo.png";
import { TeamMember } from "./types";
import { useTranslation } from "react-i18next";

interface TeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  search: string;
  setSearch: (value: string) => void;
  members: TeamMember[];
  formMembers: TeamMember[];
  currentUserId?: number;
  ownerId?: number;
  loading?: boolean;
  toggleMember: (member: TeamMember) => void;
  getInitial: (name?: string) => string;
}

export const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({
  open,
  onClose,
  search,
  setSearch,
  members,
  formMembers,
  currentUserId,
  ownerId,
  loading,
  toggleMember,
  getInitial
}) => {

    const { t } = useTranslation();

  if (!open) return null;

  const filteredMembers = members
  .filter(member => member.id !== ownerId)
  .filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1300,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <Paper
        sx={{
          borderRadius: 2, backgroundColor: 'background.paper',
          maxHeight: '80vh', width: '90%', maxWidth: 600,
          display: 'flex', flexDirection: 'column', boxShadow: 24, p: "24px"
        }}
        onClick={e => e.stopPropagation()}
      >
        <Box sx={{ pb: "24px", borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            placeholder={t('views.newProject.TeamMembers.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />
          <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 0, height: 0 }, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {loading && (
            <Box textAlign="center" py={4}>
                <CircularProgress />
            </Box>
          )}

          {!loading && filteredMembers.length > 0 && filteredMembers.map(member => {
            const isCurrentUser = member.id === currentUserId;
            const isForcedMember = Boolean(isCurrentUser && currentUserId !== ownerId);
            const isInTeam = formMembers.some(m => m.id === member.id);

            return (
              <Box
                key={member.id}
                sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, cursor: 'pointer', borderBottom: '1px solid', borderColor: 'divider' }}
                onClick={() => !isForcedMember && toggleMember(member)}
              >
                <Checkbox checked={isInTeam || isForcedMember} disabled={isForcedMember} color="primary" sx={{ mr: 1 }} />
                <Avatar src={member.avatarUrl || defaultAvatar} sx={{ width: 40, height: 40, mr: 2, bgcolor: 'transparent' }}>
                  {!member.avatarUrl && getInitial(member.name)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography fontWeight={500}>{member.name}</Typography>
                    {isCurrentUser && <Chip label="You" size="small" color="primary" sx={{ height: 20 }} />}
                    {isForcedMember && <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20 }} />}
                    <Chip label={member.invited ? "Invited" : "Verified"} size="small" color={member.invited ? "warning" : "success"} sx={{ height: 20 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                </Box>
              </Box>
            );
          })}

          {!loading && filteredMembers.length === 0 && (
            <Box textAlign="center" py={4} px={2}>
              <Typography color="text.secondary">{search ? t('views.newProject.TeamMembers.notFound') : t('views.newProject.TeamMembers.notAvailable')}</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
