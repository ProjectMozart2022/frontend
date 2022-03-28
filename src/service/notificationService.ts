import { NotificationProps } from "@mantine/notifications"
import { NotificationsContextProps } from "@mantine/notifications/lib/types"

export const showNotification = (
  notification: NotificationsContextProps,
  notificationObject: NotificationProps
) => {
  notification.showNotification(notificationObject)
}
