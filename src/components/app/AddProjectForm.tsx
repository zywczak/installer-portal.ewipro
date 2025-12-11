// AddProjectForm.tsx
import React, { useState } from "react";
import {
Box,
Button,
CircularProgress,
Snackbar,
Alert,
Card,
} from "@mui/material";
import ProjectOwnershipStep from "../common/steps/ProjectOwnershipStep";
import ProjectDetailsStep from "../common/steps/ProjectDetailsStep";
import GeneralInfoStep from "../common/steps/GeneralInfoStep";
import ProjectTypeStep from "../common/steps/ProjectTypeStep";
import WarrantyStep from "../common/steps/WarrantyStep";
import TeamMembersStep from "../common/steps/TeamMembersStep";
import api from "../../api/axiosApi";
import { FormData, TeamMember, LookupAddress } from "../common/steps/types";


export default function AddProjectForm() {
const today = new Date().toISOString().split("T")[0];

// Initialize ownerId from localStorage
const getInitialOwnerId = (): number => {
  const defaultEnabled = JSON.parse(localStorage.getItem("defaultProjectOwner") || "false");
  
  if (defaultEnabled) {
    const defaultOwnerId = Number(localStorage.getItem('defaultOwnerId'));
    if (defaultOwnerId) return defaultOwnerId;
  }
  
  // If no default owner, use current user's ID
  const userID = Number(localStorage.getItem("userID"));
  return userID || 0;
};

const [formData, setFormData] = useState<FormData>({
postCode: "",
addressLine1: "",
addressLine2: "",
city: "",
occupierName: "",
startDate: today,
buildType: "",
substrate: "",
system: "",
pasRole: "",
warrantyProvider: "",
warrantyPeriod: "",
ownerId: getInitialOwnerId(),
ownerName: "",
ownerPhone: "",
ownerEmail: "",
companyName: "",
ownershipRole: "",
teamMembers: [],
});

const [isPostcodeValid, setIsPostcodeValid] = useState<boolean | null>(null);
const [saving, setSaving] = useState(false);
const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
  open: false,
  message: '',
  severity: 'success'
});

const canShowNextSteps =
  isPostcodeValid === true &&
  formData.addressLine1.trim() !== "" &&
  formData.city.trim() !== "";

// Mapowanie wartości tekstowych na ID
const mapBuildTypeToId = (buildType: string): number => {
  const mapping: Record<string, number> = {
    "New Build": 2,
    "Retrofit or Refurbishment": 1,
  };
  return mapping[buildType];
};

const mapSubstrateToId = (substrate: string): number => {
  const mapping: Record<string, number> = {
    "Standard Brick": 2,
    "Block": 3,
    "Other Masonry (Cavity, Stone, Clay)": 4,
    "Park Home": 5,
    "Timber Frame / SIPS": 6,
    "Metal Frame": 7,
    "ICF": 8,
    "Other": 1,
  };
  return mapping[substrate] || 1;
};

const mapSystemToId = (system: string): number => {
  const mapping: Record<string, number> = {
    "EWI EPS": 1,
    "EWI Mineral Wool": 2,
    "EWI K5": 3,
    "Render Only": 4,
    "Durashield Pro (Innovation System)": 5,
  };
  return mapping[system] || 1;
};

const mapWarrantyProviderToId = (provider: string): number => {
  const mapping: Record<string, number> = {
    "None": 0,
    "SWIGA": 2,
    "IAA": 3,
    "Quality Mark": 4,
    "Other": 1,
  };
  return mapping[provider] || 0;
};

const handleFormSubmit = async () => {
  setSaving(true);
  
  const cleanAddress = (value: any) => {
    return typeof value === "string" ? value : "";
  };

  try {
    const payload = {
      action: "saveNewProject",
      address1: cleanAddress(formData.addressLine1),
      address2: cleanAddress(formData.addressLine2),
      address3: cleanAddress(formData.city),
      postCode: formData.postCode,
      startDate: formData.startDate,
      accreditedProject: formData.pasRole === "Yes" ? 1 : 0,
      buildType: mapBuildTypeToId(formData.buildType),
      substrateType: mapSubstrateToId(formData.substrate),
      systemType: mapSystemToId(formData.system),
      warrantyYears: formData.warrantyPeriod,
      warrantyProvider: mapWarrantyProviderToId(formData.warrantyProvider),
      homeownerName: formData.occupierName,
      teamMembers: formData.teamMembers.map(member => ({
        subcontractorID: member.id,
        memberType: 123, // You may need to adjust this
        memberLoginDetails: 0
      }))
    };

    console.log("Sending payload:", payload);

    // await api.post("https://api-veen-e.ewipro.com/installer/info/", payload);
    
    setNotification({
      open: true,
      message: "Project saved successfully!",
      severity: 'success'
    });

    // Reset form or redirect after success
    // setTimeout(() => {
    //   window.location.hash = "#projects";
    // }, 1500);

  } catch (error: any) {
    console.error("Error saving project:", error);
    setNotification({
      open: true,
      message: error.response?.data?.message || "Failed to save project. Please try again.",
      severity: 'error'
    });
  } finally {
    setSaving(false);
  }
};


return (
  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px: 2, mb: 2 }}>
  <Card sx={{ border: "1px solid #e0e0e0", p: 2, width: '100%', boxSizing: 'border-box', borderRadius: 3 }}>
  <Box sx={{ maxWidth: 900, mx: "auto" }}>
    <ProjectDetailsStep
      formData={formData} 
      setFormData={setFormData}
      isPostcodeValid={isPostcodeValid}
      setIsPostcodeValid={setIsPostcodeValid}
    />

    {canShowNextSteps && (
      <>
        <GeneralInfoStep formData={formData} setFormData={setFormData as unknown as React.Dispatch<React.SetStateAction<any>>} />
        <ProjectTypeStep formData={formData} setFormData={setFormData} />
        <WarrantyStep formData={formData} setFormData={setFormData} />
        <ProjectOwnershipStep formData={formData} setFormData={setFormData} />
        <TeamMembersStep formData={formData} setFormData={setFormData} />

        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          disabled={saving}
          sx={{ 
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: "16px",
          }}
          onClick={handleFormSubmit}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : 'SAVE PROJECT'}
        </Button>
      </>
    )}

    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={() => setNotification({ ...notification, open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setNotification({ ...notification, open: false })} 
        severity={notification.severity}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  </Box>
  </Card>
</Box>
);
}