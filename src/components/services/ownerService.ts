import axios from "axios";

export const getInitial = (name: string | undefined) => {
  if (!name || typeof name !== 'string') return 'U';
  return name.charAt(0).toUpperCase();
};

export const fixAvatarUrl = (avatarUrl: string | undefined | null): string | undefined => {
  if (!avatarUrl || avatarUrl === "null" || avatarUrl === "undefined" || avatarUrl === "false") {
    return undefined;
  }
  
  if (avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  
  if (avatarUrl.startsWith('/')) {
    return `https://afd-veen-e.ewipro.com${avatarUrl}`;
  }
  
  if (avatarUrl.includes('CRMAvatars')) {
    return `https://afd-veen-e.ewipro.com/${avatarUrl}`;
  }
  
  return undefined;
};

export const loadOwners = async (setLoading?: (loading: boolean) => void) => {
  try {
    setLoading?.(true);
    const token = localStorage.getItem("access");

    const resp = await axios.post(
      "https://api-veen-e.ewipro.com/installer/info/",
      { action: "getMyOwners" },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    let ownersList = resp.data?.results || [];

    const currentUserID = Number(localStorage.getItem("userID"));
    const currentUserName = localStorage.getItem("userNameSurname") || "";
    const currentUserEmail = localStorage.getItem("userEmail") || "";
    const currentUserCompany = localStorage.getItem("companyName") || "";
    const currentUserAvatar = localStorage.getItem("userAvatar");

    const currentUserExists = ownersList.some((owner: any) => owner.userID === currentUserID);
    
    if (!currentUserExists && currentUserName) {
      const currentUser = {
        userID: currentUserID,
        namesurname: currentUserName,
        email: currentUserEmail,
        company_name: currentUserCompany,
        avatar: fixAvatarUrl(currentUserAvatar),
      };
      ownersList = [currentUser, ...ownersList];
    }
    
    const fixedOwners = ownersList.map((owner: any) => ({
      ...owner,
      avatar: fixAvatarUrl(owner.avatar)
    }));

    return fixedOwners;
  } catch (err: any) {
    console.error("Error fetching owners list:", err);
    console.error("Error details:", err.response?.data);
    return [];
  } finally {
    setLoading?.(false);
  }
};