import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  TextField,
  Checkbox,
  Popper,
  Paper,
  ClickAwayListener,
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

// Funkcja pomocnicza do pobierania inicjałów
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
  const boxRef = useRef<HTMLDivElement | null>(null);

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


// Reset i reload team members gdy owner się zmienia
useEffect(() => {
  const loadSubcontractorsForOwner = async () => {
    console.log("Owner changed, loading subcontractors for ownerId:", formData.ownerId);
      setSubcontractors([]);
      setSelectedTeamMembers(new Set());
      setFormData(prev => ({ ...prev, teamMembers: [] }));


    try {
      setSubcontractorLoading(true);
      // setSubcontractorError(null); // Komentujemy, aby uniknąć błędu kompilacji

      const result = await fetchSubcontractors(formData.ownerId, setSubcontractorLoading, setSubcontractorError);
      
      // Wyklucz ownera z listy
      const filtered = result.filter(member => member.id !== formData.ownerId);
      setSubcontractors(filtered);

      // Reset zaznaczonych członków w dialogu
      setSelectedTeamMembers(new Set());

      // Reset formData.teamMembers do currentUser jeśli nie jest ownerem
      const currentUser = getCurrentUser();
      const newTeamMembers: TeamMember[] = [];
      if (currentUser && currentUser.id !== formData.ownerId) {
        newTeamMembers.push(currentUser);
      }
      setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
    } catch (err: any) {
      // setSubcontractorError(err.message || "Failed to load team members"); // Komentujemy, aby uniknąć błędu kompilacji
      console.error("Loading error:", err);
      setSubcontractors([]);
      setSelectedTeamMembers(new Set());
    } finally {
      setSubcontractorLoading(false);
    }
  };

  loadSubcontractorsForOwner();
  // Poniżej: dodajemy poprawne zależności dla useEffect
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [formData.ownerId]);


  // Automatically add current user if not owner
  useEffect(() => {
    if (!currentUser || !formData.ownerId) return;

    const isAlreadyInTeam = formData.teamMembers.some(m => m.id === currentUser.id);
    if (!isAlreadyInTeam && currentUser.id !== formData.ownerId) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, currentUser]
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.ownerId, setFormData, currentUser]);

  // Remove owner from teamMembers if accidentally added
  useEffect(() => {
    if (formData.ownerId && formData.teamMembers.some(m => m.id === formData.ownerId)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(m => m.id !== prev.ownerId)
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.ownerId, formData.teamMembers, setFormData]);

  // Reset team members when owner changes
  // Ostatni useEffect w oryginalnym kodzie wydaje się powtarzać logikę pierwszego useEffect,
  // ale dodam logikę resetu, która była w nim ważna.
  useEffect(() => {
    if (!formData.ownerId) {
      setFormData(prev => ({ ...prev, teamMembers: [] }));
      setSubcontractors([]);
      setSelectedTeamMembers(new Set());
      return;
    }

    const currentUser = getCurrentUser();
    const newTeamMembers: TeamMember[] = [];

    // Dodaj currentUser jeśli nie jest właścicielem
    if (currentUser && currentUser.id !== formData.ownerId) {
      newTeamMembers.push(currentUser);
    }

    setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));

    // Reset selected team members w dialogu
    setSelectedTeamMembers(new Set());
    // Wymuś ponowne załadowanie podwykonawców
    setSubcontractors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Remove from team
      if (currentUser && member.id === currentUser.id && member.id !== formData.ownerId) return;
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(m => m.id !== member.id)
      }));
    } else {
      // Add to team
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
        
        {/* NAGŁÓWEK I PRZYCISK "ADD MEMBER" */}
    

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

        {/* LISTA CZŁONKÓW ZESPOŁU W FORMIE KART */}
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

      {/* MODAL Z LISTĄ WYBORU CZŁONKÓW ZESPOŁU */}
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
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

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
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
                        cursor: isForcedMember ? 'default' : 'pointer',
                        backgroundColor: isInTeam ? 'action.selected' : 'transparent',
                        '&:hover': { backgroundColor: isForcedMember ? 'action.selected' : 'action.hover' },
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






