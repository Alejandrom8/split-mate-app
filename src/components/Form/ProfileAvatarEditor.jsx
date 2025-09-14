'use client';

import { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import v1Manager from '@/shared/v1Manager';

export default function ProfileAvatarEditor({
  user,
  size = 96,
  initialSrc,             // opcional: URL inicial del avatar
  onUploaded,             // opcional: callback(url) tras subir
  authHeader,
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(initialSrc || '');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const initials =
    user?.username?.charAt(0)?.toUpperCase() ||
    user?.name?.charAt(0)?.toUpperCase() ||
    'U';

  const handleOpen = () => {
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setFile(null);
    setPreview(initialSrc || preview); // conserva el último preview si ya subiste
  };

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida.');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleSave = async () => {
    if (!file) {
      setError('Selecciona una imagen antes de guardar.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const form = new FormData();
      form.append('profile_image', file);

      const res = await v1Manager.post('/v1/users/profile/image', form, {
        headers: {
          ...authHeader.headers,
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('UPLOAD RESULT', res);

      if (!res?.data.success) {
        throw new Error(`Error al subir: ${res.status}`);
      }

      // Espera que el backend devuelva { url: 'https://...' }
      const data = await res.data.data;
      const uploadedUrl = data?.user.profile_image_url;

      if (!uploadedUrl) {
        throw new Error('La respuesta no contiene la URL del recurso.');
      }

      setPreview(uploadedUrl);
      setFile(null);
      setOpen(false);
      onUploaded?.(uploadedUrl);
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Contenedor del avatar con botón de edición superpuesto */}
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <Avatar
          src={preview || undefined}
          sx={{ width: size, height: size, fontSize: size / 2.8 }}
        >
          {initials}
        </Avatar>

        <IconButton
          size="small"
          onClick={handleOpen}
          aria-label="Editar foto de perfil"
          sx={{
            position: 'absolute',
            top: -6,
            right: -6,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 2,
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Diálogo de carga */}
      <Dialog open={open} onClose={saving ? undefined : handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Actualizar foto de perfil</DialogTitle>

        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Avatar
              src={file ? preview : preview || undefined}
              sx={{ width: 112, height: 112 }}
            >
              {initials}
            </Avatar>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePick}
            />

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => inputRef.current?.click()}
                disabled={saving}
              >
                Elegir imagen
              </Button>
              {file && (
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    setFile(null);
                    setPreview(initialSrc || '');
                    setError('');
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  disabled={saving}
                >
                  Quitar
                </Button>
              )}
            </Stack>

            {saving && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            )}

            {!!error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}