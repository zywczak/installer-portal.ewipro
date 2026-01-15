import { Box, Divider, List } from "@mui/material";
import { useState, useRef } from "react";
import MainCard from "../../common/MainCard";
import ChangePasswordItem from "./ChangePasswordItem";
import DefaultOwnerSwitch from "./DefaultOwnerSwitch";
import OwnerSelector, { Owner } from "./OwnerSelector";
import LanguageSelector from "./LanguageSelector";
import DeleteAccount from "./DeleteAccount";
import { useOwners } from "../../../hooks/useOwners";
import { useDeleteAccount } from "../../../hooks/useDeleteAccount";
import { t } from "i18next";
import i18n from "../../../i18n";
import { useAuthNotification } from "../../../context/AuthContext";

interface SettingsProps {
  navigateTo?: (newView: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  navigateTo,
}) => {
  const { showError, showSuccess } = useAuthNotification();

  const [isDefaultOwnerEnabled, setIsDefaultOwnerEnabled] = useState(() => {
    const saved = localStorage.getItem("defaultProjectOwner");
    return saved ? JSON.parse(saved) : false;
  });

  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(() => {
    const id = localStorage.getItem("defaultOwnerId");
    const name = localStorage.getItem("defaultOwnerName");
    const email = localStorage.getItem("defaultOwnerEmail");
    const avatar = localStorage.getItem("defaultOwnerAvatar");
    if (id && name && email) return { userID: Number(id), name, email, avatar: avatar || null };
    return null;
  });

  const [showOwnersList, setShowOwnersList] = useState(false);
  const ownerButtonRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const [language, setLanguage] = useState(i18n.language || "en");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { owners, loading, loadOwners } = useOwners(showError);
  const { deleting, deleteAccount } = useDeleteAccount(showSuccess, showError);

  const handleOwnerToggle = () => {
    const newValue = !isDefaultOwnerEnabled;
    setIsDefaultOwnerEnabled(newValue);
    localStorage.setItem("defaultProjectOwner", JSON.stringify(newValue));

    if (!newValue) {
      setSelectedOwner(null);
      localStorage.removeItem("defaultOwnerId");
      localStorage.removeItem("defaultOwnerName");
      localStorage.removeItem("defaultOwnerEmail");
      localStorage.removeItem("defaultOwnerAvatar");
      setShowOwnersList(false);
    }
  };

  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    localStorage.setItem("defaultOwnerId", String(owner.userID));
    localStorage.setItem("defaultOwnerName", owner.name);
    localStorage.setItem("defaultOwnerEmail", owner.email);
    localStorage.setItem("defaultOwnerAvatar", owner.avatar || "");
    setShowOwnersList(false);
  };

  const handleOwnerDropdown = async () => {
    await loadOwners();
    const rect = ownerButtonRef.current?.getBoundingClientRect();
    if (rect) setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    setShowOwnersList(prev => !prev);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 2, px: 2 }}>
      <MainCard>
        <List disablePadding sx={{ width: '100%', maxWidth: '800px', m: 'auto' }}>
          <ChangePasswordItem
            title={t("views.settings.changePassword.header")}
            description={t("views.settings.changePassword.instruction")}
            onClick={() => navigateTo?.("changepassword")}
          />

          <Divider sx={{ my: 1 }} />

          <DefaultOwnerSwitch
            checked={isDefaultOwnerEnabled}
            onChange={handleOwnerToggle}
            title={t("views.settings.useDefaultOwner.header")}
            description={t("views.settings.useDefaultOwner.description")}
          />

          <OwnerSelector
            isEnabled={isDefaultOwnerEnabled}
            selectedOwner={selectedOwner}
            owners={owners}
            loading={loading}
            showDropdown={showOwnersList}
            toggleDropdown={handleOwnerDropdown}
            dropdownPos={dropdownPos}
            onSelect={handleOwnerSelect}
            ownerButtonRef={ownerButtonRef}
          />

          <Divider sx={{ my: 1 }} />

          <LanguageSelector
            language={language}
            onChange={handleLanguageChange}
            title={t("views.settings.language")}
          />
        </List>
      </MainCard>

      <DeleteAccount
        open={deleteDialogOpen}
        onOpen={() => setDeleteDialogOpen(true)}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={deleteAccount}
        deleting={deleting}
        buttonText={t("views.settings.deleteAccount.button")}
      />
    </Box>
  );
};

export default Settings;
