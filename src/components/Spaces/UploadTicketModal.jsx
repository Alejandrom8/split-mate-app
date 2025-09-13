// components/CreateSpaceModal.jsx
import React, {useState} from 'react';
import {
  Dialog,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Stack,
  Button,
  CircularProgress, MenuItem,
} from '@mui/material';
import clientManager from "@/shared/clientManager";
import {useSnackbar} from "notistack";
import TicketDropzone from "@/components/Tickets/TicketDropzone";

// Ejemplo de datos:
const spaces = [
  { id: "s1", name: "Casa de Alex" },
  { id: "s2", name: "Oficina Jalo" },
  { id: "s3", name: "Amigos CDMX" },
];

export default function UploadTicketModal({
                                           open,
                                           onClose,
                                           onCreated, // (space) => void
                                           title = 'Sube tus tickets',
                                         }) {
  const [spaceId, setSpaceId] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const reset = () => {
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!spaceName.trim()) return; // simple validación
    setLoading(true);
    try {

    } catch (err) {
      // Puedes mostrar un snackbar desde el padre si gustas
      console.error('[CreateSpaceModal] Error:', err);
      enqueueSnackbar('Hubo un error al crear el espacio', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Card elevation={1}>
          <CardHeader title={title} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                select
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                variant="outlined"
                name="spaceId"
                size="small"
                disabled={loading}
                required
                fullWidth
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">
                  <em>Selecciona el espacio</em>
                </MenuItem>
                {spaces.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
              <TicketDropzone
                onFiles={(accepted, rejected) => {
                  console.log('Aceptados:', accepted);
                  console.log('Rechazados:', rejected);
                }}
                maxFiles={5}
                // accept={{ 'image/*': [] }} // ejemplo para solo imágenes
              />
            </Stack>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Creando...' : 'Crear'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </CardActions>
        </Card>
      </form>
    </Dialog>
  );
}