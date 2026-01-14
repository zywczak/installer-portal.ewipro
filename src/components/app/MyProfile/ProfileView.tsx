import { Box, Card, CircularProgress } from "@mui/material";
import AcceptButton from "../../common/AcceptButton";
import ProfileAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import { useProfile } from "./useProfile";
import { t } from "i18next";

const ProfileView = () => {
  const {
    user,
    photo,
    phone,
    company,
    email,
    error,
    loading,
    canSave,
    fileInputRef,
    handlePhoneChange,
    setCompany,
    handlePhotoChange,
    handleDeletePhoto,
    handleSave,
  } = useProfile();

  if (loading && !user) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, px: 2 }}>
      <Card sx={{ border: "1px solid #e0e0e0", p: 2, width: '100%', boxSizing: 'border-box', borderRadius: 2 }}>
        <Box sx={{ pt: 0, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 420, mx: "auto", mb: 1, }} >
          <ProfileAvatar
            photo={photo}
            hasAvatar={!!user?.avatar}
            fileInputRef={fileInputRef}
            onDelete={handleDeletePhoto}
            onChange={handlePhotoChange}
          />

          <ProfileForm
            name={user?.name || ""}
            email={email}
            phone={phone}
            company={company}
            error={error}
            onPhoneChange={handlePhoneChange}
            onCompanyChange={setCompany}
          />

          <Box sx={{ width: "100%", mt: 4 }}> 
            <Box sx={{ "& > *": { width: "100%" } }}>
              <AcceptButton 
                onClick={handleSave} 
                loading={loading} 
                label={t("views.profile.button")} 
                loadingLabel={t("views.profile.saving")} 
                disabled={!canSave} />
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfileView;
