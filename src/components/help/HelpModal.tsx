import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import HelpImages from "./HelpImages";
import HelpTable, { Table } from "./HelpTable";
import { HelpImage } from "../form/types";

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
}

const HelpModal: React.FC<HelpModalProps> = ({
  open,
  onClose,
  helpSections,
  isMobile = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? helpSections.length - 1 : prev - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === helpSections.length - 1 ? 0 : prev + 1
    );
  };

  if (helpSections.length === 0) return null;

  const currentHelp = helpSections[currentIndex];

  const modalContent = (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          display: "flex",
          flexDirection: "column",
          height: isMobile ? "95vh" : "90vh",
          maxHeight: isMobile ? "95vh" : "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "background.paper",
          borderBottom: "1px solid #ddd",
          p: isMobile ? 1 : 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {helpSections.length > 1 && (
            <IconButton onClick={handlePrev} size={isMobile ? "small" : "medium"}>
              <ArrowBackIosNewIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          )}
          <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
            {currentHelp.help_title}
          </Typography>
          {helpSections.length > 1 && (
            <IconButton onClick={handleNext} size={isMobile ? "small" : "medium"}>
              <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          )}
        </Box>
        <IconButton onClick={onClose} size={isMobile ? "small" : "medium"}>
          <CloseIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          p: isMobile ? 1 : 2,
        }}
      >
        {currentHelp.description && (
          <Typography
            variant="body2"
            sx={{ 
              mb: 2, 
              fontSize: isMobile ? "13px" : "14px",
              lineHeight: 1.4 
            }}
          >
            {currentHelp.description}
          </Typography>
        )}

        {currentHelp.images && currentHelp.images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <HelpImages images={currentHelp.images}/>
          </Box>
        )}

        {currentHelp.tables &&
          currentHelp.tables.length > 0 &&
          currentHelp.tables.map((table) => (
            <Box key={table.id} sx={{ mb: 3 }}>
              <HelpTable table={table} />
            </Box>
          ))}
      </DialogContent>
    </Dialog>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default HelpModal;