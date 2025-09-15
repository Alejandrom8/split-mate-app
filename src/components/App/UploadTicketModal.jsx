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
  CircularProgress, MenuItem, Box,
} from '@mui/material';
import clientManager from "@/shared/clientManager";
import {useSnackbar} from "notistack";
import TicketDropzone from "@/components/Tickets/TicketDropzone";
import SpaceSelector from "@/components/Form/SpaceSelector";
import FileCard from "@/components/Form/FIleCard";
import v1Manager from "@/shared/v1Manager";

export default function UploadTicketModal({
   _authHeader,
   _spaceId,
   open,
   onClose,
   onCreated, // (space) => void
   title = 'Sube un ticket',
 }) {
  const [spaceId, setSpaceId] = useState(_spaceId);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const reset = () => {
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('event_id', spaceId);

      const res = await v1Manager.post('/v1/tickets/upload/rest', form, {
        headers: {
          ..._authHeader.headers,
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('UPLOAD RESULT', res);

      if (!res?.data.success) {
        throw new Error(`Error al subir: ${res.status}`);
      }

      onCreated?.(res?.data?.data);
      enqueueSnackbar('Ticket subido con éxito', { variant: 'success' });
    } catch (err) {
      // Puedes mostrar un snackbar desde el padre si gustas
      console.error('[CreateSpaceModal] Error:', err);
      enqueueSnackbar('Hubo un error al subir el ticket', { variant: 'error' });
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
              {
                !_spaceId && (
                  <SpaceSelector
                    onChange={(_sid) => setSpaceId(_sid)}
                    value={spaceId}
                    label="Espacio"
                    placeholder="Selecciona el espacio"
                  />
                )
              }
              <TicketDropzone
                onFiles={(accepted, rejected) => {
                  setFiles(accepted);
                  console.log('Aceptados:', accepted);
                  console.log('Rechazados:', rejected);
                }}
                maxFiles={1}
                accept={{ 'image/*': [] }}
              />
              <Box>
                {files.map((f) => (
                  <FileCard
                    key={f.path}
                    file={f}
                    onDelete={(file) => setFiles([])}
                  />
                ))}
              </Box>
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
              {loading ? 'Subiendo...' : 'Subir'}
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