import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormTextField from "./TextField";
import { LookupAddress } from "./types";

interface AddressLookupDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly addresses: LookupAddress[];
  readonly loading: boolean;
  readonly onSelect: (address: LookupAddress) => void;
  readonly onManual: () => void;
}

export default function AddressLookupDialog({
  open,
  onClose,
  addresses,
  loading,
  onSelect,
  onManual,
}: AddressLookupDialogProps) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<LookupAddress[]>(addresses);

  useEffect(() => {
    if (search.trim()) {
        setFiltered(
        addresses.filter((a) =>
          a.line_1.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
        setFiltered(addresses);
    }
  }, [search, addresses]);

  let content;
  if (loading) {
    content = (
      <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
        Loading addresses...
      </Typography>
    );
  } else if (filtered.length > 0) {
    content = (
      <List sx={{ pt: 0 }}>
        {filtered.map((a) => (
          <ListItem
            key={a.udprn}
            onClick={() => onSelect(a)}
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "action.hover" },
              borderBottom: "1px solid",
              borderColor: "divider",
              py: 2,
              px: 2,
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary={a.line_1}
              secondary={a.town ? `${a.town}, ${a.traditional_county || ""}` : ""}
            slotProps={{
                primary: { sx: { fontWeight: 500 } },
            }}
            />
          </ListItem>
        ))}
      </List>
    );
  } else {
    content = (
      <Box textAlign="center" py={4} px={2}>
        <Typography color="text.secondary" mb={2}>
          We couldn't find any address for this postcode.
        </Typography>
        <Button variant="outlined" onClick={onManual}>
          Add manually
        </Button>
      </Box>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
        sx: { margin: { xs: 1, sm: 2 }, maxHeight: "85vh", borderRadius: "12px", padding: "24px" },
      }
    }}
    >
      <DialogTitle
        sx={{ fontWeight: 600, display: "flex", justifyContent: "space-between", p: 0 }}
      >
        Select Address
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ py: "24px" }}>
          <FormTextField
            placeholder="Search addresses..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            size="small"
          />
        </Box>

        <Box
          sx={{
            maxHeight: "400px",
            overflow: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {content}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
