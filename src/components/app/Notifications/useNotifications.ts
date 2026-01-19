import { useEffect, useState, useCallback } from "react";
import api from "../../../api/axiosApi";
import { Notification } from "./types";
import { useAuthNotification } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

interface UseNotificationsProps {
  notifications: Notification[];
  onUnreadChange?: (hasUnread: boolean) => void;
}

export const useNotifications = ({
  notifications,
  onUnreadChange,
}: UseNotificationsProps) => {
  const { showError } = useAuthNotification();

  const [localNotifications, setLocalNotifications] =
    useState<Notification[]>(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    onUnreadChange?.(
      localNotifications.some((n) => !n.read)
    );
  }, [localNotifications, onUnreadChange]);

  const { t } = useTranslation();
  
  const sendAction = useCallback(
    async (action: string, notificationID: number) => {
      try {
        await api.post({ action, notificationID });
      } catch (err: any) {
        console.error("Notification API error:", err);
        showError(t("views.notifications.error"));
      }
    },
    []
  );

  const toggleRead = useCallback(
    (notif: Notification) => {
      const action = notif.read
        ? "markNotificationUnread"
        : "markNotificationRead";

      setLocalNotifications((prev) =>
        prev.map((n) =>
          n.id === notif.id
            ? { ...n, read: !n.read }
            : n
        )
      );

      sendAction(action, notif.id);
    },
    [sendAction]
  );

  const deleteNotification = useCallback(
    (notif: Notification) => {
      setLocalNotifications((prev) =>
        prev.filter((n) => n.id !== notif.id)
      );

      sendAction("deleteNotification", notif.id);
    },
    [sendAction]
  );

  return {
    notifications: localNotifications,
    toggleRead,
    deleteNotification,
  };
};
