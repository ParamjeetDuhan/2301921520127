import { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
} from "@mui/material";

import { createNotification } from "../api/notificationApi";

export default function CreateNotification({
  reload,
}) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    studentId: "",
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createNotification(form);

      setOpen(false);

      setForm({
        studentId: "",
        type: "",
        message: "",
      });

      reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setOpen(true)}
      >
        Create Notification
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          Create Notification
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Student ID"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            select
            margin="dense"
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <MenuItem value="Placement">
              Placement
            </MenuItem>

            <MenuItem value="Event">
              Event
            </MenuItem>

            <MenuItem value="Result">
              Result
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            margin="dense"
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}