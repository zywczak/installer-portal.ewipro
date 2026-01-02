import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { isValidPostcode, lookupAddress } from "../../services/addressService";
import { FormData, LookupAddress } from "./types";

interface ProjectDetailsStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isPostcodeValid: boolean | null;
  setIsPostcodeValid: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function ProjectDetailsStep({
  formData,
  setFormData,
  isPostcodeValid,
  setIsPostcodeValid,
}: ProjectDetailsStepProps) {
  const [addressResults, setAddressResults] = useState<LookupAddress[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<LookupAddress | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [filteredAddresses, setFilteredAddresses] = useState<LookupAddress[]>([]);
  const [popupSearch, setPopupSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "postCode") {
      setFormData((prev) => ({ ...prev, postCode: value }));
      setSelectedAddress(null);
      setManualEntry(false);

      const valid = isValidPostcode(value);
      setIsPostcodeValid(valid);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddressDialog = () => {
    const code = formData.postCode.trim();
    if (!isValidPostcode(code)) return;
    handleLookupAddress(code.toUpperCase());
    setPopupSearch("");
    setAddressDialogOpen(true);
  };

  const handleLookupAddress = async (postcode: string) => {
    setLoadingAddress(true);
    setAddressResults([]);
    setFilteredAddresses([]);
    setSelectedAddress(null);
    setManualEntry(false);

    try {
      const addresses = await lookupAddress(postcode);

      const formattedAddresses: LookupAddress[] = addresses.map((addr: any) => ({
  line_1: typeof addr.line_1 === "string" ? addr.line_1 : " ",
  line_2: typeof addr.line_2 === "string" ? addr.line_2 : " ",
  town: typeof addr.town === "string" ? addr.town : " ",
  traditional_county: typeof addr.traditional_county === "string" ? addr.traditional_county : " ",
  udprn: addr.udprn || "",
  postcode: typeof addr.postcode === "string" ? addr.postcode : postcode,
}));


      setAddressResults(formattedAddresses);
      setFilteredAddresses(formattedAddresses);
    } catch (err) {
      console.error("Lookup error:", err);
      setAddressResults([]);
      setFilteredAddresses([]);
    }

    setLoadingAddress(false);
  };

  useEffect(() => {
    if (popupSearch.trim() === "") {
      setFilteredAddresses(addressResults);
    } else {
      setFilteredAddresses(
        addressResults.filter((a) =>
          a.line_1.toLowerCase().includes(popupSearch.toLowerCase())
        )
      );
    }
  }, [popupSearch, addressResults]);

  const chooseAddress = (addr: LookupAddress) => {
    setSelectedAddress(addr);
    setManualEntry(false);

    setFormData((prev) => ({
      ...prev,
      postCode: addr.postcode || "",
      addressLine1: addr.line_1 || "",
      addressLine2: addr.line_2 || "",
      city: addr.town || "",
    }));

    setAddressDialogOpen(false);
  };

  const chooseManual = () => {
    setSelectedAddress(null);
    setManualEntry(true);

    setFormData((prev) => ({
      ...prev,
      addressLine1: "",
      addressLine2: "",
      city: "",
    }));

    setAddressDialogOpen(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Address
      </Typography>

      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Post Code"
          name="postCode"
          value={formData.postCode}
          onChange={handleChange}
          error={isPostcodeValid === false}
          helperText={isPostcodeValid === false ? "Invalid UK or ROI postcode." : ""}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={openAddressDialog}
                disabled={!isValidPostcode(formData.postCode.trim())}
                color="primary"
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              backgroundColor: 'white',
              padding: 0,
              '& .MuiInputBase-input': { padding: '16px 14px' },
              '& .MuiOutlinedInput-notchedOutline': { borderRadius: '16px' },
            },
          }}
        />

        {loadingAddress && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Loading addresses...
          </Typography>
        )}

        <Dialog
          open={addressDialogOpen}
          onClose={() => setAddressDialogOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { margin: { xs: 1, sm: 2 }, maxHeight: '85vh', borderRadius: "12px", padding: "24px" } }}
        >
          <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 0 }}>
            Select Address
            <IconButton onClick={() => setAddressDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ py: "24px" }}>
              <TextField
                fullWidth
                placeholder="Search addresses..."
                value={popupSearch}
                onChange={(e) => setPopupSearch(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    padding: 0,
                    '& .MuiInputBase-input': { padding: '10px 12px' },
                    '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px' },
                  },
                }}
              />
            </Box>

           <Box
  sx={{
    maxHeight: '400px',
    overflow: 'auto',

    scrollbarWidth: 'none',
    msOverflowStyle: 'none',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }}
>
              {filteredAddresses.length > 0 ? (
                <List sx={{ pt: 0 }}>
                  {filteredAddresses.map((a) => (
                    <ListItem
                      key={a.udprn}
                      onClick={() => chooseAddress(a)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 2,
                        px: 2,
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={a.line_1}
                        secondary={a.town ? `${a.town}, ${a.traditional_county || ''}` : ''}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4} px={2}>
                  <Typography color="text.secondary" mb={2}>
                    We couldn't find any address for this postcode.
                  </Typography>
                  <Button variant="outlined" onClick={chooseManual}>
                    Add manually
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
        </Dialog>

        {(manualEntry || selectedAddress) && (
          <>
            <TextField
              fullWidth
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              disabled={!manualEntry && selectedAddress !== null}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  padding: 0,
                  '& .MuiInputBase-input': { padding: '16px 14px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderRadius: '16px' },
                },
              }}
            />

            <TextField
              fullWidth
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              disabled={!manualEntry && selectedAddress !== null}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  padding: 0,
                  '& .MuiInputBase-input': { padding: '16px 14px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderRadius: '16px' },
                },
              }}
            />

            <TextField
              fullWidth
              label="City / Town"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!manualEntry && selectedAddress !== null}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  padding: 0,
                  '& .MuiInputBase-input': { padding: '16px 14px' },
                  '& .MuiOutlinedInput-notchedOutline': { borderRadius: '16px' },
                },
              }}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
