import * as React from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box, Button, Card, CardActions, CardContent, CardHeader, CardActionArea,
  CircularProgress, Dialog, IconButton, ListItemIcon, Menu, MenuItem,
  Stack, TextField, Typography, Chip, Tooltip
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { useSnackbar } from 'notistack';
// import clientManager from '@/lib/clientManager';
import AvatarGroupTight from '@/components/App/AvatarGroupTight';

// Helper: tiempo relativo “hace 2 días”
function timeFromNow(dateInput) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffSeconds = Math.round((date - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  const units = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    const value = Math.trunc(diffSeconds / secondsInUnit);
    if (Math.abs(value) >= 1) return rtf.format(value, unit);
  }
  return 'justo ahora';
}

export default function SpaceCard({ item, onDelete }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openConfirmSpaceDeletion, setOpenConfirmSpaceDeletion] = useState(false);
  const [confirmSpaceName, setConfirmSpaceName] = useState('');
  const [loading, setLoading] = useState(false);

  const enableSpaceActions = true;
  const absoluteDate = useMemo(
    () => new Date(item.event_date).toLocaleDateString('es-MX', { dateStyle: 'medium' }),
    [item.event_date]
  );
  const relativeDate = useMemo(() => timeFromNow(item.event_date), [item.event_date]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClick = () => router.push(`/space/${item.id}`);

  const handleSpaceDeletion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientManager.delete(`/space/${item.id}`);
      enqueueSnackbar('Espacio borrado exitosamente', { variant: 'success' });
      handleCancelDeletion();
      onDelete?.(item);
    } catch (error) {
      enqueueSnackbar(`Hubo un error al eliminar el espacio: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeletion = () => {
    setOpenConfirmSpaceDeletion(false);
    setConfirmSpaceName('');
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          cursor: 'pointer',
          borderColor: 'divider',
          transition: 'all .2s ease',
          borderRadius: 1,
          '&:hover': {
            boxShadow: 3,
          },
          padding: 0,
        }}
      >
        <CardActionArea onClick={handleClick} sx={{ alignItems: 'stretch' }}>
          <CardContent sx={{ pb: 1.5 }}>
            {/* Header: título + acciones */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 800 }}>
                  {item.name}
                </Typography>
                {item?.member_role === 'owner' && (
                  <Chip size="small" label="Propietario" color="primary" variant="outlined" />
                )}
              </Stack>

              {/* {enableSpaceActions && item?.member_role === 'owner' && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e);
                    }}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                    aria-label="acciones del espacio"
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
              )} */}
            </Stack>

            {/* Fecha y descripción */}
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EventIcon fontSize="small" color="disabled" />
                <Chip
                  size="small"
                  variant="outlined"
                  label={absoluteDate}
                  sx={{ borderColor: 'divider' }}
                />
                <Typography variant="caption" color="text.secondary">
                  • {relativeDate}
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {item.description}
              </Typography>

              {/* Miembros */}
              <Stack direction="row" spacing={2} alignItems="center">
                {/* Si tu AvatarGroupTight permite tooltip por miembro, pasa title/names dentro */}
                <AvatarGroupTight members={item?.members} size="medium" />
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Menú contextual */}
      <Menu
        id="space-card-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { style: { maxHeight: 48 * 4.5, width: '18ch' } },
          list: { 'aria-labelledby': 'space-card-menu' },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenConfirmSpaceDeletion(true);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Borrar
        </MenuItem>
      </Menu>

      {/* Confirmación de borrado */}
      <Dialog
        open={openConfirmSpaceDeletion}
        onClose={() => setOpenConfirmSpaceDeletion(false)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={handleSpaceDeletion}>
          <Card elevation={1}>
            <CardHeader title="¿Seguro de que deseas borrar este espacio?" />
            <CardContent>
              <Stack spacing={3}>
                <Typography>
                  Se borrará toda la información relacionada y se perderán los tickets para todos dentro del espacio.
                </Typography>
                <Typography>
                  Escribe: <strong>{item.name}</strong>
                </Typography>
                <TextField
                  value={confirmSpaceName}
                  onChange={(e) => setConfirmSpaceName(e.target.value)}
                  variant="outlined"
                  type="text"
                  name="spaceName"
                  label="Nombre"
                  placeholder="Confirma el nombre del espacio"
                  disabled={loading}
                  required
                  autoFocus
                />
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                disabled={loading || confirmSpaceName !== item.name}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {loading ? 'Borrando...' : 'Borrar espacio'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleCancelDeletion}
                disabled={loading}
              >
                Cancelar
              </Button>
            </CardActions>
          </Card>
        </form>
      </Dialog>
    </>
  );
}