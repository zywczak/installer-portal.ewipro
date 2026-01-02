import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  TextField,
  Checkbox,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { fetchSubcontractors } from "../../services/teamService";
import { FormData, TeamMember } from "./types";
import defaultAvatar from "../../../assets/profile-photo.png";

interface TeamMembersStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const getInitial = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
};

export default function TeamMembersStep({ formData, setFormData }: TeamMembersStepProps) {
  const [subcontractors, setSubcontractors] = useState<TeamMember[]>([]);
  const [subcontractorLoading, setSubcontractorLoading] = useState(false);
  const [subcontractorError, setSubcontractorError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamMemberSearch, setTeamMemberSearch] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Set<number>>(new Set());

  const getCurrentUser = (): TeamMember | null => {
    const userId = Number(localStorage.getItem("userID"));
    const userName = localStorage.getItem("userNameSurname");
    const userEmail = localStorage.getItem("userEmail");
    const userAvatar = localStorage.getItem("userAvatar");

    if (userId && userName && userEmail) {
      return {
        id: userId,
        name: userName,
        role: "User",
        email: userEmail,
        avatarUrl: userAvatar || undefined,
        invited: false
      };
    }
    return null;
  };

  const currentUser = getCurrentUser();
  const isCurrentUserOwner = currentUser && currentUser.id === formData.ownerId;

useEffect(() => {
  const loadSubcontractorsForOwner = async () => {
    console.log("Owner changed, loading subcontractors for ownerId:", formData.ownerId);
      setSubcontractors([]);
      setSelectedTeamMembers(new Set());
      setFormData(prev => ({ ...prev, teamMembers: [] }));


    try {
      setSubcontractorLoading(true);

      const result = await fetchSubcontractors(formData.ownerId, setSubcontractorLoading, setSubcontractorError);
      
      const filtered = result.filter(member => member.id !== formData.ownerId);
      setSubcontractors(filtered);

      setSelectedTeamMembers(new Set());

      const currentUser = getCurrentUser();
      const newTeamMembers: TeamMember[] = [];
      if (currentUser && currentUser.id !== formData.ownerId) {
        newTeamMembers.push(currentUser);
      }
      setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
    } catch (err: any) {
      console.error("Loading error:", err);
      setSubcontractors([]);
      setSelectedTeamMembers(new Set());
    } finally {
      setSubcontractorLoading(false);
    }
  };

  loadSubcontractorsForOwner();
}, [formData.ownerId]);

  useEffect(() => {
    if (!currentUser || !formData.ownerId) return;

    const isAlreadyInTeam = formData.teamMembers.some(m => m.id === currentUser.id);
    if (!isAlreadyInTeam && currentUser.id !== formData.ownerId) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, currentUser]
      }));
    }
  }, [formData.ownerId, setFormData, currentUser]);

  useEffect(() => {
    if (formData.ownerId && formData.teamMembers.some(m => m.id === formData.ownerId)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(m => m.id !== prev.ownerId)
      }));
    }
  }, [formData.ownerId, formData.teamMembers, setFormData]);

  useEffect(() => {
    if (!formData.ownerId) {
      setFormData(prev => ({ ...prev, teamMembers: [] }));
      setSubcontractors([]);
      setSelectedTeamMembers(new Set());
      return;
    }

    const currentUser = getCurrentUser();
    const newTeamMembers: TeamMember[] = [];

    if (currentUser && currentUser.id !== formData.ownerId) {
      newTeamMembers.push(currentUser);
    }

    setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));

    setSelectedTeamMembers(new Set());

    setSubcontractors([]);
  }, [formData.ownerId]);


  const openTeamMembersDialog = () => {
    const currentIds = new Set(formData.teamMembers.map(member => member.id));

    if (currentUser && !isCurrentUserOwner) {
      currentIds.delete(currentUser.id);
    }

    setSelectedTeamMembers(currentIds);
    setTeamMemberSearch("");
    setMenuOpen(true);
  };

  const handleToggleMenu = () => {
    if (!menuOpen) {
      openTeamMembersDialog();
    } else {
      setMenuOpen(false);
    }
  };

  const toggleTeamMemberSelection = (member: TeamMember) => {
    const isAlreadyInTeam = formData.teamMembers.some(m => m.id === member.id);
    
    if (isAlreadyInTeam) {
      if (currentUser && member.id === currentUser.id && member.id !== formData.ownerId) return;
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(m => m.id !== member.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, member]
      }));
    }
  };

  const removeTeamMember = (id: number) => {
    if (currentUser && id === currentUser.id && id !== formData.ownerId) return;

    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  const filteredTeamMembers = subcontractors
    .filter(member => member.id !== formData.ownerId)
    .filter(member =>
      member.name.toLowerCase().includes(teamMemberSearch.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(teamMemberSearch.toLowerCase()))
    );

  return (
    <Box sx={{ mb: 4 }}>
        
<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Team members</Typography>

        <Button
          variant="outlined"
          color="success"
          startIcon={<AddIcon/>}
          onClick={handleToggleMenu}
        >
          Add member
        </Button>
      </Box>

        {formData.teamMembers.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
  {formData.teamMembers.map(member => {
    const isCurrentUser = currentUser && member.id === currentUser.id;
    const isOwner = member.id === formData.ownerId;
    if (isOwner) return null;

    return (
      <Box
        key={member.id}
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
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {member.name}
            {isCurrentUser && (
              <Typography component="span" variant="body1" sx={{ color: 'text.secondary', ml: 1 }}>
                (me)
              </Typography>
            )}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {member.email || member.role || "Team Member"}
          </Typography>
        </Box>
        {!isCurrentUser && (
          <IconButton size="small" onClick={() => removeTeamMember(member.id)} sx={{ ml: 1, flexShrink: 0 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  })}
</Box>
        ) : (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                No team members added yet. Click 'Add member' to select subcontractors.
            </Typography>
        )}

      {menuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <Paper
            sx={{
              borderRadius: 2,
              backgroundColor: 'background.paper',
              maxHeight: '80vh',
              width: '90%',
              maxWidth: 600,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 24,
              p: "24px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ pb: "24px",borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Search team members..."
                value={teamMemberSearch}
                onChange={(e) => setTeamMemberSearch(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  }
                }}
              />
              <IconButton size="small" onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1,  overflowY: 'auto',

    /* ukrycie scrollbara */
    '&::-webkit-scrollbar': { width: 0, height: 0 },
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
    
  }}>
              {subcontractorLoading && (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">Loading team members...</Typography>
                </Box>
              )}

              {!subcontractorLoading && filteredTeamMembers.length > 0 && (
                <Box>
                {filteredTeamMembers.map(member => {
                  const isCurrentUser = currentUser && member.id === currentUser.id;
                  const isForcedMember = Boolean(isCurrentUser && !isCurrentUserOwner);
                  const isInTeam = formData.teamMembers.some(m => m.id === member.id);

                  return (
                    <Box
                      key={member.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 1.5,
                        cursor: 'pointer',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                      onClick={() => !isForcedMember && toggleTeamMemberSelection(member)}
                    >
                      <Checkbox
                        checked={isInTeam || isForcedMember}
                        disabled={isForcedMember}
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Avatar
                        src={member.avatarUrl || defaultAvatar}
                        sx={{ width: 40, height: 40, mr: 2, bgcolor: 'transparent' }}
                      >
                        {!member.avatarUrl && getInitial(member.name)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography fontWeight={500}>{member.name}</Typography>
                          {isCurrentUser && <Chip label="You" size="small" color="primary" sx={{ height: 20 }} />}
                          {isForcedMember && <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20 }} />}
                          <Chip 
                            label={member.invited ? "Invited" : "Verified"} 
                            size="small" 
                            color={member.invited ? "warning" : "success"} 
                            sx={{ height: 20 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">{member.email}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

              {!subcontractorLoading && filteredTeamMembers.length === 0 && (
                <Box textAlign="center" py={4} px={2}>
                  <Typography color="text.secondary">
                    {teamMemberSearch ? "No team members found" : "No team members available"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}