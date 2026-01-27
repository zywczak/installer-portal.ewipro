import { useState, useEffect } from "react";
import { Notification } from "../../components/app/Notifications/types"; 

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await fetch("https://api-veen-e.ewipro.com/installer/info/", {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            action: "getUserNotifications",
            limit: 50,
          }),
        });

        if (!res.ok) {
          throw new Error("Network error: " + res.status);
        }

        const data = await res.json();
        console.log("Raw notifications data:", data);

        const mapped = (data?.results || []).map((n: any) => ({
          id: n.id?.toString(),
          title: n.title ?? "Powiadomienie",
          message: n.message ?? "", 
          projectID: n.projectID ?? undefined,
          contactID: n.contactID ?? undefined, 
          slug: n.slug ?? "",
          date: n.date ?? "", 
          read: !(n.unread ?? false), 
        }));
        
        console.log("Fetched notifications:", mapped);
        setNotifications(mapped);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return {
    notifications,
    hasUnreadNotifications,
    anchorEl,
    drawerOpen,
    setHasUnreadNotifications,
    setAnchorEl,
    setDrawerOpen,
  };
};