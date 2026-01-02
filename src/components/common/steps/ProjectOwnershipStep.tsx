import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Avatar,
  Box,
  Button,
  Chip,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";

import { getInitial, loadOwners } from "../../services/ownerService";
import { FormData } from "./types";
import defaultAvatar from "../../../assets/profile-photo.png";

interface Owner {
  userID: number;
  namesurname: string;
  email: string;
  company_name?: string;
  avatar?: string;
}

interface ProjectOwnershipStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ProjectOwnershipStep({ formData, setFormData }: ProjectOwnershipStepProps) {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [availableOwners, setAvailableOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const getAvatarUrl = (avatarUrl: string | undefined | null): string => {
    if (!avatarUrl || avatarUrl === "null" || avatarUrl === "undefined") return defaultAvatar;
    if (avatarUrl.startsWith('http')) return avatarUrl;
    if (avatarUrl.startsWith('/')) return `https://afd-veen-e.ewipro.com${avatarUrl}`;
    return avatarUrl;
  };

  useEffect(() => {
    const initializeOwner = () => {
      const defaultEnabled = JSON.parse(localStorage.getItem("defaultProjectOwner") || "false");
      let owner: Owner | null = null;

      if (defaultEnabled) {
        const defaultOwnerId = Number(localStorage.getItem('defaultOwnerId'));
        const defaultOwnerName = localStorage.getItem('defaultOwnerName');
        const defaultOwnerEmail = localStorage.getItem('defaultOwnerEmail');
        const defaultOwnerAvatar = localStorage.getItem('defaultOwnerAvatar');

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
    };

    initializeOwner();
  }, [setFormData]);

  const handleToggleMenu = async () => {
    setMenuOpen(prev => !prev);

    if (!menuOpen && availableOwners.length === 0) {
      setLoadingOwners(true);
      const owners = await loadOwners(setLoadingOwners);

      const userID = Number(localStorage.getItem("userID"));
      const userNameSurname = localStorage.getItem("userNameSurname") || "";
      const userEmail = localStorage.getItem("userEmail") || "";
      const userAvatar = localStorage.getItem("userAvatar");

      let fixedOwners: Owner[] = owners.map((o: any) => {
        if (o.userID === userID) {
          return {
            userID: o.userID,
            namesurname: userNameSurname || o.name,
            email: userEmail || o.email,
            company_name: o.companyName,
            avatar: getAvatarUrl(userAvatar || o.avatar),
          };
        }
        return {
          userID: o.userID,
          namesurname: o.name,
          email: o.email,
          company_name: o.companyName,
          avatar: getAvatarUrl(o.avatar),
        };
      });

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
  };

  const handleOwnerSelect = (owner: Owner) => {
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
  };

  return (
    <Box sx={{ mb: 4, position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Project ownership</Typography>
        <Button
          variant="outlined"
          color="success"
          startIcon={<LoopIcon />}
          onClick={handleToggleMenu}
        >
          Change owner
        </Button>
      </Box>

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
        <Avatar
          src={selectedOwner?.avatar}
          sx={{ width: 48, height: 48, mr: 2, bgcolor: selectedOwner?.avatar ? 'transparent' : 'primary.main' }}
        >
          {!selectedOwner?.avatar && getInitial(selectedOwner?.namesurname)}
        </Avatar>
        <Box>
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
               /* ukrycie scrollbara */
    '&::-webkit-scrollbar': { width: 0, height: 0 },
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
            }}
          >
            {loadingOwners && <Box sx={{ px: 3, py: 2 }}>Loading owners...</Box>}

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
                <Avatar
                  src={owner.avatar}
                  sx={{ width: 32, height: 32, mr: 2, bgcolor: owner.avatar ? 'transparent' : 'primary.main' }}
                >
                  {!owner.avatar && getInitial(owner.namesurname)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography>{owner.namesurname}</Typography>
                  <Typography variant="body2" color="text.secondary">{owner.email}</Typography>
                </Box>
                {owner.userID === Number(localStorage.getItem("userID")) && (
                  <Chip label="You" size="small" sx={{ ml: 1 }} />
                )}
              </Box>
            ))}

            {!loadingOwners && availableOwners.length === 0 && <Box sx={{ px: 3, py: 2 }}>No owners available</Box>}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
