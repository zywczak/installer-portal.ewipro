import React, { useState } from "react";
import { Typography, Stack, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { isValidPostcode, lookupAddress } from "./addressService";
import { FormData, LookupAddress } from "./types";
import FormTextField from "./TextField";
import AddressLookupDialog from "./AddressLookupDialog";
import { useTranslation } from "react-i18next";

interface ProjectDetailsStepProps {
  readonly formData: FormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  readonly isPostcodeValid: boolean | null;
  readonly setIsPostcodeValid: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function ProjectDetailsStep({
  formData,
  setFormData,
  isPostcodeValid,
  setIsPostcodeValid,
}: ProjectDetailsStepProps) {
  const { t } = useTranslation();
  const [addressResults, setAddressResults] = useState<LookupAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<LookupAddress | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "postCode") {
      setFormData((prev) => ({ ...prev, postCode: value }));
      setSelectedAddress(null);
      setManualEntry(false);
      setIsPostcodeValid(isValidPostcode(value));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openDialog = async () => {
    const code = formData.postCode.trim();
    if (!isValidPostcode(code)) return;
    setLoadingAddress(true);
    setDialogOpen(true);
    setSelectedAddress(null);
    setManualEntry(false);
    try {
      const addresses = await lookupAddress(code.toUpperCase());
      const formatted: LookupAddress[] = addresses.map((addr: any) => ({
        line_1: addr.line_1 || " ",
        line_2: addr.line_2 || " ",
        town: addr.town || " ",
        traditional_county: addr.traditional_county || " ",
        udprn: addr.udprn || "",
        postcode: addr.postcode || code,
      }));
      setAddressResults(formatted);
    } catch (err) {
      console.error("Lookup error:", err);
      setAddressResults([]);
    }
    setLoadingAddress(false);
  };

  const handleSelectAddress = (addr: LookupAddress) => {
    setSelectedAddress(addr);
    setManualEntry(false);
    setFormData((prev) => ({
      ...prev,
      postCode: addr.postcode || "",
      addressLine1: addr.line_1 || "",
      addressLine2: addr.line_2 || "",
      city: addr.town || "",
    }));
    setDialogOpen(false);
  };

  const handleManual = () => {
    setSelectedAddress(null);
    setManualEntry(true);
    setFormData((prev) => ({ ...prev, addressLine1: "", addressLine2: "", city: "" }));
    setDialogOpen(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t('views.newProject.SelectAddress.Header')}
      </Typography>

      <Stack spacing={2}>
        <FormTextField
          label={t('views.newProject.SelectAddress.Form.postCode.label')}
          name="postCode"
          value={formData.postCode}
          onChange={handleChange}
          error={isPostcodeValid === false}
          helperText={isPostcodeValid === false ? t('views.newProject.SelectAddress.Form.postCode.labelDescription') : ""}
          slotProps={{
            input: {
            endAdornment: (
              <IconButton
                onClick={openDialog}
                disabled={!isValidPostcode(formData.postCode.trim())}
                color="primary"
              >
                <SearchIcon />
              </IconButton>
            ),
          }
          }}
        />

        {(manualEntry || selectedAddress) && (
          <>
            <FormTextField
              label={t('views.newProject.AddressForm.Form.addressLine1.label')}
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              disabled={!manualEntry && selectedAddress !== null}
            />
            <FormTextField
              label={t('views.newProject.AddressForm.Form.addressLine2.label')}
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              disabled={!manualEntry && selectedAddress !== null}
            />
            <FormTextField
              label={t('views.newProject.AddressForm.Form.city.label')}
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!manualEntry && selectedAddress !== null}
            />
          </>
        )}
      </Stack>

      <AddressLookupDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        addresses={addressResults}
        loading={loadingAddress}
        onSelect={handleSelectAddress}
        onManual={handleManual}
      />
    </Box>
  );
}
