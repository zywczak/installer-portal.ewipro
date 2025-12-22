import React, { useState } from "react";
import {
  Dialog,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpImages from "./HelpImages";
import HelpTable, { Table } from "./HelpTable";
import { HelpImage } from "../../../form/types";

interface HelpSection {
  id: number;
  help_title: string;
  description?: string | null;
  images?: HelpImage[];
  tables?: Table[];
}

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  helpSections: HelpSection[];
  isMobile?: boolean;
  container?: HTMLElement | null;
}

const HelpModal: React.FC<HelpModalProps> = ({
  open,
  onClose,
  helpSections,
  isMobile = false,
  container,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (helpSections.length === 0) return null;
  const currentHelp = helpSections[currentIndex];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      container={container}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        "& .MuiBackdrop-root": { 
          position: "absolute",
          backgroundColor: "transparent",
          boxShadow: "none"
        },
        "& .MuiDialog-container": { 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center", 
          justifyContent: "center",
        },
      }}
      PaperProps={{
        sx: {
          width: "1245px",
          maxHeight: "625px",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
          pb: "40px",
        },
      }}
    >
      {/* Przycisk zamknięcia */}
      <IconButton
        onClick={onClose}
        sx={{
          alignSelf: "flex-end",
          mr: "10px",
          my: "6px",
          backgroundColor: "#000",
          borderRadius: "50%",
          height: "24px",
          width: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        <CloseIcon sx={{ color: "#fff", fontSize: "16px" }} />
      </IconButton>

      {/* Główny kontener Flexbox */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "22px",
          height: "100%",
          width: "100%",
        }}
      >
        {/* Lewa kolumna: Teksty */}
        <Box
          sx={{
            pl: "32px",
            pt: "10px",
            flex: "0 0 295px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{ fontWeight: 700, mb: "28px", color: "#333333", fontSize: "16px" }}
          >
            Help
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: "50px", lineHeight: "38px", fontSize: "32px" }}
          >
            {currentHelp.help_title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontWeight: 400, fontSize: "12px" }}
          >
            {currentHelp.description}
          </Typography>
        </Box>

        {/* Prawa kolumna: Szary kontener */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f4f4f4",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            boxSizing: "border-box",
            maxHeight: "545px",
            p: "28px",
            overflowY: "auto",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {currentHelp.images && currentHelp.images.length > 0 && (
            <HelpImages images={currentHelp.images} />
          )}

          {currentHelp.tables &&
            currentHelp.tables.map((table) => (
              <Box key={table.id} sx={{ mt: 2 }}>
                <HelpTable table={table} />
              </Box>
            ))}
        </Box>
      </Box>
    </Dialog>
  );
};

export default HelpModal;