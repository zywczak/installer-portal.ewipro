import { useEffect, useRef, useState } from "react";
import api from "../../../api/axiosApi";
import { useAuthNotification } from "../../../context/AuthContext";
import { phoneRegex, getUserPhone } from "./profile.utils";
import { UserProfile } from "./profile.types";
import profilePhoto from "../../../assets/profile-photo.png";
import { t } from "i18next";

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [photo, setPhoto] = useState<string>(profilePhoto);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showError, showSuccess } = useAuthNotification();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.post({ action: "getBasicUserData" });

      setUser(data);
      setPhoto(data?.avatar || profilePhoto);
      setPhone(getUserPhone(data));
      setCompany(data?.company_name || "");
    } catch (err) {
      console.error("Błąd pobierania profilu:", err);
      showError("Nie udało się pobrać danych użytkownika");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (!val.trim()) setError(t("views.profile.form.errors.phoneRequired"));
    else if (phoneRegex.test(val)) setError(null);
    else setError(t("views.profile.form.errors.phone"));
  };

  const handleDeletePhoto = async () => {
    if (!user?.avatar) return;

    setLoading(true);
    try {
      await api.post({ action: "deleteUserAvatar" });
      setPhoto(profilePhoto);
      setPhotoChanged(false);
      setUser((prev: UserProfile | null) => (prev ? { ...prev, avatar: null } : null));
      showSuccess(t("views.profile.photoDeleteSuccess"));
    } catch (err) {
        console.error("Błąd usuwania zdjęcia:", err);
        showError(t("views.profile.photoDeleteError"));
    } finally {
      setLoading(false);
    }
  };

   const handlePhotoChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setPhotoChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (photoChanged && fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append("action", "postAvatarToUserProfile");
        formData.append("avatar", fileInputRef.current.files[0]);

        await api.post(formData, { headers: { "Content-Type": "multipart/form-data" } });
        setPhotoChanged(false);
        showSuccess(t("views.profile.uploadingPictureSuccess"));
      }

      const phoneChanged = phone !== (getUserPhone(user) || "");
      const companyChanged = company !== (user?.company_name || "");

      if (phoneChanged || companyChanged) {
        await api.post({
          action: "updateProfileBilling",
          phoneNumber: phone,
          companyName: company,
        });
        showSuccess(t("views.profile.formSuccessfullySubmitted"));
      }
    } catch (err) {
      console.error("Błąd zapisu:", err);
      showError(t("views.profile.formSubmitError"));
    } finally {
      setLoading(false);
    }
  };

  const canSave =
    photoChanged ||
    (phone !== (getUserPhone(user) || "") && phoneRegex.test(phone) && !error) ||
    company !== (user?.company_name || "");

  return {
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
  };
};
