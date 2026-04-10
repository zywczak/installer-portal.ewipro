import React, { useState } from "react";
import { Box, Card, Stack, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTranslation } from "react-i18next";
import FormTextField from "../../common/FormTextField";
import AcceptButton from "../../common/AcceptButton";
import { SubcontractorInfo } from './types';
import api from "../../../api/axiosApi";

interface InfoTabProps {
  info: SubcontractorInfo;
  subcontractorId: string;
  onDeleted?: () => void;
}

const InfoTab: React.FC<InfoTabProps> = ({ info, subcontractorId, onDeleted }) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.post({
        action: "deleteSubcontrator",
        subcontractorID: Number(subcontractorId),
      });
      setConfirmOpen(false);
      onDeleted?.();
    } catch (e: any) {
      setDeleteError(
        e?.response?.data?.message ||
        t("views.subcontractors.deleteDialog.error", "Failed to delete. Please try again.")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card
        data-subcontractor-id={subcontractorId}
        sx={{
          border: "1px solid #e0e0e0",
          p: 3,
          width: "100%",
          mx: "auto",
          borderRadius: 2,
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            pt: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 420,
            mx: "auto",
          }}
        >
          <Stack spacing={5} sx={{ width: "100%" }}>
            <FormTextField
              value={info?.name || ""}
              onChange={() => {}}
              placeholder={t("views.profile.form.name")}
              size="small"
            />
            <FormTextField
              value={info?.email || ""}
              onChange={() => {}}
              placeholder={t("views.profile.form.email")}
              size="small"
              disabled
            />
            <FormTextField
              value={info?.mobile || ""}
              onChange={() => {}}
              placeholder={t("views.profile.form.phone")}
              size="small"
            />
            <FormTextField
              value={info?.companyName || ""}
              onChange={() => {}}
              placeholder={t("views.profile.form.company")}
              size="small"
            />
          </Stack>

          <Box sx={{ width: "100%", mt: 4 }}>
            <Box sx={{ "& > *": { width: "100%" } }}>
              <AcceptButton
                onClick={() => {}}
                loading={false}
                label={t("views.profile.button")}
                loadingLabel={t("views.profile.saving")}
                disabled={true}
                size="small"
              />
            </Box>

            <Box sx={{ mt: 2, "& > *": { width: "100%" } }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setConfirmOpen(true)}
                sx={{ textTransform: "none" }}
              >
                {t("views.subcontractors.deleteDialog.button", "Delete Subcontractor")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>

      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {t("views.subcontractors.deleteDialog.title", "Delete Subcontractor")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              "views.subcontractors.deleteDialog.message",
              "Are you sure you want to delete {{name}}? This action cannot be undone.",
              { name: info?.name || "" }
            )}
          </DialogContentText>
          {deleteError && (
            <Box mt={1} color="error.main" fontSize={14}>
              {deleteError}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
            color="inherit"
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            color="error"
            variant="contained"
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}
          >
            {deleting
              ? t("common.deleting", "Deleting...")
              : t("common.delete", "Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InfoTab;