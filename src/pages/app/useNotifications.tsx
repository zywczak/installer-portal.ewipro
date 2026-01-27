import { useState, useEffect } from "react";
import { Notification } from "../../components/app/Notifications/types";
import api from "../../api/axiosApi";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.post({
          action: "getUserNotifications",
          limit: 50,
        });

        const mapped = (res.data?.results || []).map((n: any) => ({
          id: n.id?.toString(),
          title: n.title ?? "Powiadomienie",
          message: n.message ?? "",
          projectID: n.projectID ?? undefined,
          contactID: n.contactID ?? undefined,
          slug: n.slug ?? "",
          date: n.date ?? "",
          read: !(n.unread ?? false),
        }));

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
