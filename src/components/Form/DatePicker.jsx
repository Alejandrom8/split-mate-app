// components/SingleDateModalPicker.jsx
import * as React from "react";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import es from "date-fns/locale/es";
import {fmtDate} from "@/shared/utils";

export default function DatePicker({
                                                label = "Fecha",
                                                value,
                                                onChange,
                                                minDate = null,
                                                maxDate = null,
                                                disablePast = false,
                                                disableFuture = false,
                                              }) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value ?? null);

  const handleOpen = () => {
    setDraft(value ?? new Date());
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleAccept = () => {
    onChange && onChange(draft ?? null);
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <TextField
        fullWidth
        label={label}
        value={fmtDate(value)}
        placeholder="Selecciona una fecha"
        onClick={handleOpen}
        InputProps={{ readOnly: true }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pr: 6 }}>
          Selecciona una fecha
          <IconButton
            aria-label="Cerrar"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ pt: 1 }}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={draft}
              onChange={(newVal) => setDraft(newVal)}
              minDate={minDate}
              maxDate={maxDate}
              disablePast={disablePast}
              disableFuture={disableFuture}
              slotProps={{ actionBar: { actions: [] } }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleAccept}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}