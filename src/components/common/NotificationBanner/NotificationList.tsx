import React from "react";
import ScrollableContainerWithArrows from "../ScrollableContainerWithArrows";
import EmptyStateBox from "../EmptyStateBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationItem from "./NotificationItem";
import { Notification } from "./types";

interface Props {
  notifications: Notification[];
  onToggleRead: (n: Notification) => void;
  onDelete: (n: Notification) => void;
  onClick: (n: Notification) => void;
  showArrows?: boolean;
}

const NotificationList: React.FC<Props> = ({
  notifications,
  onToggleRead,
  onDelete,
  onClick,
  showArrows = true,
}) => {
  if (notifications.length === 0) {
    return (
      <ScrollableContainerWithArrows showArrows={false}>
        <EmptyStateBox
          icon={<VisibilityIcon />}
          text="No notifications"
        />
      </ScrollableContainerWithArrows>
    );
  }

  return (
    <ScrollableContainerWithArrows showArrows={showArrows}>
      {notifications.map((n, idx) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onClick={() => onClick(n)}
          onToggleRead={() => onToggleRead(n)}
          onDelete={() => onDelete(n)}
          isLast={idx === notifications.length - 1}
        />
      ))}
    </ScrollableContainerWithArrows>
  );
};

export default NotificationList;
