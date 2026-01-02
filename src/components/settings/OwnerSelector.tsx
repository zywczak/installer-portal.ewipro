import React from "react";
import { Box, ListItemButton, ListItemText, CircularProgress } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UserAvatar from "../common/UserAvatar";

export interface Owner {
  userID: number;
  name: string;
  email: string;
  avatar?: string | null;
}

interface Props {
  isEnabled: boolean;
  selectedOwner: Owner | null;
  owners: Owner[];
  loading: boolean;
  showDropdown: boolean;
  toggleDropdown: () => void;
  dropdownPos: { top: number; left: number; width: number };
  onSelect: (owner: Owner) => void;
  ownerButtonRef: React.RefObject<HTMLDivElement | null>;
}

const OwnerSelector: React.FC<Props> = ({
  isEnabled,
  selectedOwner,
  owners,
  loading,
  showDropdown,
  toggleDropdown,
  dropdownPos,
  onSelect,
  ownerButtonRef,
}) => {
  if (!isEnabled) return null;

  const dropdownContent = (() => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress size={26} />
        </Box>
      );
    }

    if (owners.length === 0) {
      return <Box sx={{ textAlign: "center", p: 2 }}>Brak ownerów do wyboru</Box>;
    }

    return owners
      .filter(o => o.userID !== selectedOwner?.userID)
      .map(owner => (
        <ListItemButton key={owner.userID} onClick={() => onSelect(owner)}>
          <Box sx={{ mr: 2 }}>
            <UserAvatar avatarUrl={owner.avatar || undefined} size={36} />
          </Box>
          <ListItemText primary={owner.name} secondary={owner.email} />
        </ListItemButton>
      ));
  })();

  return (
    <>
      <Box sx={{ position: "relative", ml: 6 }}>
        <ListItemButton ref={ownerButtonRef} onClick={toggleDropdown} sx={{ pb: 2, px: 2 }}>
          <Box sx={{ mr: 2 }}>
            <UserAvatar avatarUrl={selectedOwner?.avatar || undefined} size={42} />
          </Box>

          <ListItemText
            primary={selectedOwner ? selectedOwner.name : "Kliknij aby wybrać"}
            secondary={selectedOwner?.email || ""}
          />

          {/* Strzałka */}
          <ArrowForwardIosIcon
            sx={{
              color: "green",
              fontSize: "large",
              transform: showDropdown ? "rotate(90deg)" : "none",
              transition: "0.2s",
            }}
          />
        </ListItemButton>
      </Box>

      {showDropdown && (
        <Box
          sx={{
            position: "fixed",
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            border: "1px solid #ddd",
            borderRadius: 2,
            maxHeight: 250,
            overflowY: "auto",
            bgcolor: "background.paper",
            zIndex: 99999,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          {dropdownContent}
        </Box>
      )}
    </>
  );
};

export default OwnerSelector;