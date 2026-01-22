import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Card,
} from "@mui/material";
import ProjectOwnershipStep from "./ProjectOwnershipStep";
import ProjectDetailsStep from "./ProjectDetailsStep";
import GeneralInfoStep from "./GeneralInfoStep";
import ProjectTypeStep from "./ProjectTypeStep";
import WarrantyStep from "./WarrantyStep";
import TeamMembersStep from "./TeamMembersStep";
import { FormData } from "./types";
import {
  getInitialOwnerId,
  getTodayDate,
  isFormValid,
  canShowNextSteps as canShowSteps,
} from "../../../utils/formHelpers";
import { createProjectPayload } from "../../../utils/projectPayload";
import api from "../../../api/axiosApi";
import { useAuthNotification } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function AddProjectForm() {
  const { t } = useTranslation();

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

  const canShowNextSteps = canShowSteps(
    isPostcodeValid,
    formData.addressLine1,
    formData.city
  );

  const { showSuccess, showError } = useAuthNotification();

  const handleFormSubmit = async () => {
    setSaving(true);

    try {
      const payload = createProjectPayload(formData);
      console.log("Sending payload:", payload);

      await api.post(payload);

      showSuccess(t("views.newProject.OnSuccessfullyCreatedProject.message"));

      setTimeout(() => {
        globalThis.location.hash = "#projects";
      }, 1500);
    } catch (error: any) {
      console.error("Error saving project:", error);
      showError(error.response?.data?.message || "Failed to save project. Please try again.",)
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

        </Box>
      </Card>
    </Box>
  );
}