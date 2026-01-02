import api from "../../api/axiosApi";

export const getInitial = (name: string | undefined) => {
  if (!name || typeof name !== "string") return "U";
  return name.charAt(0).toUpperCase();
};

export const fixAvatarUrl = (
  avatarUrl: string | undefined | null
): string | undefined => {
  if ( !avatarUrl ) {
    return undefined;
  }

  return avatarUrl;
};

export const loadOwners = async (
  setLoading?: (loading: boolean) => void
) => {
  try {
    setLoading?.(true);

    const resp = await api.post({
      action: "getMyOwners",
    });

    let ownersList = resp.data?.results || [];

    const currentUserID = Number(localStorage.getItem("userID"));
    const currentUserName =
      localStorage.getItem("userNameSurname") || "";
    const currentUserEmail =
      localStorage.getItem("userEmail") || "";
    const currentUserCompany =
      localStorage.getItem("companyName") || "";
    const currentUserAvatar =
      localStorage.getItem("userAvatar");

    const currentUserExists = ownersList.some(
      (owner: any) => owner.userID === currentUserID
    );

    if (!currentUserExists && currentUserName) {
      ownersList = [
        {
          userID: currentUserID,
          namesurname: currentUserName,
          email: currentUserEmail,
          company_name: currentUserCompany,
          avatar: fixAvatarUrl(currentUserAvatar),
        },
        ...ownersList,
      ];
    }

    return ownersList.map((owner: any) => ({
      ...owner,
      avatar: fixAvatarUrl(owner.avatar),
    }));
  } catch (err: any) {
    console.error("Error fetching owners list:", err);
    console.error("Error details:", err.response?.data);
    return [];
  } finally {
    setLoading?.(false);
  }
};
