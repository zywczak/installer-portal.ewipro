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
import { FormData } from "../common/steps/types";
import {
  getInitialOwnerId,
  getTodayDate,
  isFormValid,
  canShowNextSteps as canShowSteps,
} from "../../utils/formHelpers";
import { createProjectPayload } from "../../utils/projectPayload";

const API_ENDPOINT = "https://api-veen-e.ewipro.com/installer/info/";

export default function AddProjectForm() {
  const [formData, setFormData] = useState<FormData>({
    postCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    occupierName: "",
    startDate: getTodayDate(),
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
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const canShowNextSteps = canShowSteps(
    isPostcodeValid,
    formData.addressLine1,
    formData.city
  );

  const handleFormSubmit = async () => {
    setSaving(true);

    try {
      const payload = createProjectPayload(formData);
      console.log("Sending payload:", payload);

      /// await api.post(API_ENDPOINT, payload);

      setNotification({
        open: true,
        message: "Project saved successfully!",
        severity: "success",
      });

      // Reset form or redirect after success
      // setTimeout(() => {
      //   window.location.hash = "#projects";
      // }, 1500);
    } catch (error: any) {
      console.error("Error saving project:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to save project. Please try again.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: 2,
        px: 2,
        mb: 2,
      }}
    >
      <Card
        sx={{
          border: "1px solid #e0e0e0",
          p: "24px",
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 3,
        }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <ProjectDetailsStep
            formData={formData}
            setFormData={setFormData}
            isPostcodeValid={isPostcodeValid}
            setIsPostcodeValid={setIsPostcodeValid}
          />

          {canShowNextSteps && (
            <>
              <GeneralInfoStep
                formData={formData}
                setFormData={
                  setFormData as unknown as React.Dispatch<
                    React.SetStateAction<any>
                  >
                }
              />
              <ProjectTypeStep formData={formData} setFormData={setFormData} />
              <WarrantyStep formData={formData} setFormData={setFormData} />
              <ProjectOwnershipStep
                formData={formData}
                setFormData={setFormData}
              />
              <TeamMembersStep formData={formData} setFormData={setFormData} />

              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                disabled={saving || !isFormValid(formData)}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "16px",
                }}
                onClick={handleFormSubmit}
              >
                {saving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "SAVE PROJECT"
                )}
              </Button>
            </>
          )}

          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setNotification({ ...notification, open: false })}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </Card>
    </Box>
  );
}