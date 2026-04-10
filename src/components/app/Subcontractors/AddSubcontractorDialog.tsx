import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import api from "../../../api/axiosApi"; // adjust path to your api file

interface Role {
  id: number;
  name: string;
  accentColor: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddSubcontractorDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();

  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [defaultRole, setDefaultRole] = useState<number | "">("");
  const [invite, setInvite] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRolesLoading(true);
    api
      .post({ action: "getSubcontractorsRoles" })
      .then((res) => {
        if (res.data?.results) setRoles(res.data.results);
      })
      .catch(() => setError("Failed to load roles."))
      .finally(() => setRolesLoading(false));
  }, [open]);

  const resetForm = () => {
    setName("");
    setCompanyName("");
    setEmail("");
    setMobile("");
    setDefaultRole("");
    setInvite(true);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("views.subcontractors.addDialog.errors.nameRequired", "Name is required."));
      return;
    }
    if (!email.trim()) {
      setError(t("views.subcontractors.addDialog.errors.emailRequired", "Email is required."));
      return;
    }
    if (defaultRole === "") {
      setError(t("views.subcontractors.addDialog.errors.roleRequired", "Role is required."));
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await api.post({
        action: "saveSubcontrator",
        name: name.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        defaultRole,
        invite,
      });
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        t("views.subcontractors.addDialog.errors.generic", "Something went wrong. Please try again.");
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {t("views.subcontractors.addDialog.title", "Add Subcontractor")}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {success ? (
          <Box textAlign="center" py={3}>
            <Alert severity="success">
              {t("views.subcontractors.addDialog.success", "Subcontractor added successfully!")}
            </Alert>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label={t("views.subcontractors.addDialog.fields.name", "Name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={submitting}
            />

            <TextField
              label={t("views.subcontractors.addDialog.fields.company", "Company Name")}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              disabled={submitting}
            />

            <TextField
              label={t("views.subcontractors.addDialog.fields.email", "Email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              disabled={submitting}
            />

            <TextField
              label={t("views.subcontractors.addDialog.fields.phone", "Phone")}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              fullWidth
              disabled={submitting}
            />

            <TextField
              select
              label={t("views.subcontractors.addDialog.fields.role", "Role")}
              value={defaultRole}
              onChange={(e) => setDefaultRole(Number(e.target.value))}
              fullWidth
              required
              disabled={submitting || rolesLoading}
            >
              {rolesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Loading...
                </MenuItem>
              ) : (
                roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: role.accentColor,
                          flexShrink: 0,
                        }}
                      />
                      {role.name}
                    </Box>
                  </MenuItem>
                ))
              )}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={invite}
                  onChange={(e) => setInvite(e.target.checked)}
                  disabled={submitting}
                />
              }
              label={t("views.subcontractors.addDialog.fields.invite", "Send invitation email")}
            />
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={handleClose} disabled={submitting} color="inherit">
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting
              ? t("common.saving", "Saving...")
              : t("views.subcontractors.addDialog.submit", "Add Subcontractor")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AddSubcontractorDialog;