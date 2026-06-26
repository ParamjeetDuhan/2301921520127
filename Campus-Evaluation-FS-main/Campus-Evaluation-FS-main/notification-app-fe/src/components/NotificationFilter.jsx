import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function NotificationFilter({
  type,
  setType,
}) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Notification Type</InputLabel>

      <Select
        value={type}
        label="Notification Type"
        onChange={(e) => setType(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>

        <MenuItem value="Placement">
          Placement
        </MenuItem>

        <MenuItem value="Event">
          Event
        </MenuItem>

        <MenuItem value="Result">
          Result
        </MenuItem>
      </Select>
    </FormControl>
  );
}