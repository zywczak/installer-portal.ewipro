import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Typography,
  Box,
  Button,
  Chip,
  Popper,
  Paper,
  ClickAwayListener,
  CircularProgress
} from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import { useTranslation } from "react-i18next";

import { loadOwners } from "./ownerService";
import { FormData } from "./types";
import UserAvatar from "../../common/UserAvatar";

interface Owner {
  userID: number;
  namesurname: string;
  email: string;
  company_name?: string;
  avatar?: string;
}

interface ProjectOwnershipStepProps {
  readonly formData: FormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ProjectOwnershipStep({ formData, setFormData }: ProjectOwnershipStepProps) {
  const { t } = useTranslation();
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [availableOwners, setAvailableOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // ---------- Helpers ----------
  const getAvatarUrl = useCallback((avatarUrl?: string | null) => {
    if (!avatarUrl || avatarUrl === "null" || avatarUrl === "undefined") return undefined;
    if (avatarUrl.startsWith("http")) return avatarUrl;
    if (avatarUrl.startsWith("/")) return `https://afd-veen-e.ewipro.com${avatarUrl}`;
    return avatarUrl;
  }, []);

  const initializeOwner = useCallback(() => {
    let owner: Owner | null = null;
    const defaultEnabled = JSON.parse(localStorage.getItem("defaultProjectOwner") || "false");

    if (defaultEnabled) {
      const defaultOwnerId = Number(localStorage.getItem("defaultOwnerId"));
      const defaultOwnerName = localStorage.getItem("defaultOwnerName");
      const defaultOwnerEmail = localStorage.getItem("defaultOwnerEmail");
      const defaultOwnerAvatar = localStorage.getItem("defaultOwnerAvatar");

      if (defaultOwnerId && defaultOwnerName && defaultOwnerEmail) {
        owner = {
          userID: defaultOwnerId,
          namesurname: defaultOwnerName,
          email: defaultOwnerEmail,
          avatar: getAvatarUrl(defaultOwnerAvatar),
        };
      }
    }

    if (!owner) {
      const userID = Number(localStorage.getItem("userID"));
      const userName = localStorage.getItem("userNameSurname") || "";
      const userEmail = localStorage.getItem("userEmail") || "";
      const companyName = localStorage.getItem("companyName") || "";
      const userAvatar = localStorage.getItem("userAvatar");

      if (userID && userName && userEmail) {
        owner = {
          userID,
          namesurname: userName,
          email: userEmail,
          company_name: companyName,
          avatar: getAvatarUrl(userAvatar),
        };
      }
    }

    if (owner) {
      setSelectedOwner(owner);
      setFormData(prev => ({
        ...prev,
        ownerId: owner.userID,
        ownerName: owner.namesurname,
        ownerEmail: owner.email,
        companyName: owner.company_name || "",
      }));
    }
  }, [getAvatarUrl, setFormData]);

  // ---------- Effects ----------
  useEffect(() => {
    initializeOwner();
  }, [initializeOwner]);

  // ---------- Handlers ----------
  const handleToggleMenu = useCallback(async () => {
    setMenuOpen(prev => !prev);

    if (!menuOpen && availableOwners.length === 0) {
      setLoadingOwners(true);
      const owners = await loadOwners(setLoadingOwners);

      const userID = Number(localStorage.getItem("userID"));
      const userNameSurname = localStorage.getItem("userNameSurname") || "";
      const userEmail = localStorage.getItem("userEmail") || "";
      const userAvatar = localStorage.getItem("userAvatar");

      const fixedOwners: Owner[] = owners.map((o: any) => ({
        userID: o.userID,
        namesurname: o.userID === userID ? userNameSurname || o.name : o.name,
        email: o.userID === userID ? userEmail || o.email : o.email,
        company_name: o.companyName,
        avatar: getAvatarUrl(o.userID === userID ? userAvatar || o.avatar : o.avatar),
      }));

      if (userID && !fixedOwners.some(o => o.userID === userID)) {
        fixedOwners.unshift({
          userID,
          namesurname: userNameSurname,
          email: userEmail,
          avatar: getAvatarUrl(userAvatar),
        });
      }

      setAvailableOwners(fixedOwners);
      setLoadingOwners(false);
    }
  }, [availableOwners.length, getAvatarUrl, menuOpen]);

  const handleOwnerSelect = useCallback((owner: Owner) => {
    setSelectedOwner(owner);
    setFormData(prev => ({
      ...prev,
      ownerId: owner.userID,
      ownerName: owner.namesurname,
      ownerEmail: owner.email,
      companyName: owner.company_name || "",
      teamMembers: prev.teamMembers.filter(m => m.id !== owner.userID),
    }));
    setMenuOpen(false);
  }, [setFormData]);

  // ---------- JSX ----------
  return (
    <Box sx={{ mb: 4, position: "relative" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>{t('views.newProject.ProjectOwner.Header')}</Typography>
        <Button variant="outlined" color="success" startIcon={<LoopIcon />} onClick={handleToggleMenu}>
          {t('views.newProject.ChangeOwnerBottomSheet.header')}
        </Button>
      </Box>

      {/* Selected Owner */}
      <Box
        ref={boxRef}
        sx={{
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: "16px",
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          cursor: 'pointer'
        }}
        onClick={handleToggleMenu}
      >
        <UserAvatar
          avatarUrl={selectedOwner?.avatar}
          size={48}
          tooltip="Owner Avatar"
        />
        <Box sx={{ ml: 2 }}>
          <Typography fontWeight={500}>{selectedOwner?.namesurname}</Typography>
          <Typography variant="body2" color="text.secondary">{selectedOwner?.email || ""}</Typography>
        </Box>
      </Box>

      <Popper open={menuOpen} anchorEl={boxRef.current} placement="bottom-start" style={{ zIndex: 1300 }}>
        <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
          <Paper
            sx={{
              mt: 1,
              borderRadius: 2,
              backgroundColor: 'background.paper',
              maxHeight: 300,
              overflowY: 'auto',
              boxShadow: 3,
              minWidth: boxRef.current?.offsetWidth,
              '&::-webkit-scrollbar': { width: 0, height: 0 },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {loadingOwners && <CircularProgress />}

            {!loadingOwners && availableOwners.map(owner => (
              <Box
                key={owner.userID}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  cursor: 'pointer',
                  backgroundColor: selectedOwner?.userID === owner.userID ? 'action.selected' : 'transparent',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
                onClick={() => handleOwnerSelect(owner)}
              >
                <UserAvatar
                  avatarUrl={owner.avatar}
                  size={48}
                />
                <Box sx={{ flexGrow: 1, ml: 1 }}>
                  <Typography>{owner.namesurname}</Typography>
                  <Typography variant="body2" color="text.secondary">{owner.email}</Typography>
                </Box>
                {owner.userID === Number(localStorage.getItem("userID")) && <Chip label="You" size="small" sx={{ ml: 1 }} />}
              </Box>
            ))}

            {!loadingOwners && availableOwners.length === 0 && <Box sx={{ px: 3, py: 2 }}>{t('views.newProject.projectOwner.noOwnersAvailable')}</Box>}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
