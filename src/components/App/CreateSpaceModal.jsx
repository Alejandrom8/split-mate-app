// components/CreateSpaceModal.jsx
import React from 'react';
import {
  Dialog,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';
import clientManager from "@/shared/clientManager";
import {useSnackbar} from "notistack";

export default function CreateSpaceModal({
                                           open,
                                           onClose,
                                           onCreated, // (space) => void
                                           title = 'Crea un espacio',
                                         }) {
  const [spaceName, setSpaceName] = React.useState('');
  const [spaceDescription, setSpaceDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const reset = () => {
    setSpaceName('');
    setSpaceDescription('');
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!spaceName.trim()) return; // simple validación
    setLoading(true);
    try {
      const space = await clientManager.post('/space/create', {
        name: spaceName,
        description: spaceDescription,
        event_date: new Date().toISOString().split('T')[0],
      });
      onCreated?.(space);
      enqueueSnackbar('Espacio creado exitosamente', { variant: 'success' });
      reset();
      onClose?.();
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
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                variant="outlined"
                type="text"
                name="spaceName"
                label="Nombre"
                placeholder="Ingresa el nombre del espacio"
                disabled={loading}
                required
                autoFocus
              />
              <TextField
                value={spaceDescription}
                onChange={(e) => setSpaceDescription(e.target.value)}
                variant="outlined"
                type="text"
                name="spaceDescription"
                label="Descripción"
                placeholder="Ingresa la descripción del espacio"
                disabled={loading}
                multiline
                minRows={2}
              />
            </Stack>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !spaceName.trim()}
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