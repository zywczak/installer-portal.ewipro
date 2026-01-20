import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchSubcontractors } from "./teamService";
import { FormData, TeamMember } from "./types";
import { TeamMemberList } from "./TeamMemberList";
import { TeamMemberDialog } from "./TeamMemberDialog";
import { useTranslation } from "react-i18next";

interface TeamMembersStepProps {
  readonly formData: FormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function TeamMembersStep({ formData, setFormData }: TeamMembersStepProps) {
  const { t } = useTranslation();
  
  const [subcontractors, setSubcontractors] = useState<TeamMember[]>([]);
  const [subcontractorLoading, setSubcontractorLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamMemberSearch, setTeamMemberSearch] = useState("");

  const getInitial = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0].toUpperCase();
  };

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

  useEffect(() => {
    const loadSubcontractorsForOwner = async () => {
      setSubcontractors([]);
      setFormData(prev => ({ ...prev, teamMembers: [] }));

      try {
        setSubcontractorLoading(true);
        const result = await fetchSubcontractors(formData.ownerId, setSubcontractorLoading);
        const filtered = result.filter(member => member.id !== formData.ownerId);
        setSubcontractors(filtered);

        const newTeamMembers: TeamMember[] = [];
        if (currentUser && currentUser.id !== formData.ownerId) newTeamMembers.push(currentUser);

        setFormData(prev => ({ ...prev, teamMembers: newTeamMembers }));
      } catch (err: any) {
        console.error("Loading error:", err);
        setSubcontractors([]);
      } finally {
        setSubcontractorLoading(false);
      }
    };

    if (formData.ownerId) loadSubcontractorsForOwner();
  }, [formData.ownerId]);

  const toggleTeamMemberSelection = (member: TeamMember) => {
    const isAlreadyInTeam = formData.teamMembers.some(m => m.id === member.id);

    if (isAlreadyInTeam) {
      if (currentUser?.id === member.id && member.id !== formData.ownerId) return;
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter(m => m.id !== member.id)
      }));
    } else {
      setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, member] }));
    }
  };

  const removeTeamMember = (id: number) => {
    if (currentUser?.id === id && id !== formData.ownerId) return;

    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  const openTeamMembersDialog = () => {
    setTeamMemberSearch("");
    setMenuOpen(true);
  };

  const handleToggleMenu = () => {
    if (menuOpen) setMenuOpen(false);
    else openTeamMembersDialog();
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>{t('views.newProject.TeamMembers.Header')}</Typography>
        <Button variant="outlined" color="success" startIcon={<AddIcon />} onClick={handleToggleMenu}>
          {t('views.newProject.TeamMembers.addMemberButton')}
        </Button>
      </Box>

      <TeamMemberList
        members={formData.teamMembers}
        currentUserId={currentUser?.id}
        ownerId={formData.ownerId}
        onRemove={removeTeamMember}
      />

      <TeamMemberDialog
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        search={teamMemberSearch}
        setSearch={setTeamMemberSearch}
        members={subcontractors}
        formMembers={formData.teamMembers}
        currentUserId={currentUser?.id}
        ownerId={formData.ownerId}
        loading={subcontractorLoading}
        toggleMember={toggleTeamMemberSelection}
        getInitial={getInitial}
      />
    </Box>
  );
}
