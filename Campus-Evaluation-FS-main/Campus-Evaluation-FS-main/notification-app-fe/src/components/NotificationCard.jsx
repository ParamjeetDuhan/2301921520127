import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";

import {
  deleteNotification,
  markAsRead,
} from "../api/notificationApi";

export default function NotificationCard({
  notification,
  reload,
}) {
  const handleDelete = async () => {
    await deleteNotification(notification.id);
    reload();
  };

  const handleRead = async () => {
    await markAsRead(notification.id);
    reload();
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {notification.type}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          {notification.message}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {new Date(notification.createdAt).toLocaleString()}
        </Typography>

        <Chip
          sx={{ mt: 2 }}
          label={notification.isRead ? "Read" : "Unread"}
          color={notification.isRead ? "success" : "warning"}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleRead}
            disabled={notification.isRead}
          >
            Mark Read
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}