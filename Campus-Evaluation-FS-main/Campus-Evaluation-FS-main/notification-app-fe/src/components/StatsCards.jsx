import { Grid, Paper, Typography } from "@mui/material";

export default function StatsCards({
  notifications,
}) {

  const total = notifications.length;

  const read = notifications.filter(
    n => n.isRead
  ).length;

  const unread = total - read;

  const cardStyle = {
    p: 3,
    textAlign: "center",
  };

  return (

    <Grid
      container
      spacing={2}
      sx={{ mb: 4 }}
    >

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={cardStyle}>
          <Typography variant="h6">
            Total
          </Typography>

          <Typography variant="h4">
            {total}
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={cardStyle}>
          <Typography variant="h6">
            Read
          </Typography>

          <Typography variant="h4">
            {read}
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={cardStyle}>
          <Typography variant="h6">
            Unread
          </Typography>

          <Typography variant="h4">
            {unread}
          </Typography>
        </Paper>
      </Grid>

    </Grid>

  );

}