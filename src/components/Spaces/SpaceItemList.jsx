import * as React from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ListItem, ListItemButton, ListItemAvatar, ListItemText,
  Avatar, IconButton, Menu, MenuItem, ListItemIcon, Stack, Chip,
  Typography, Divider, Dialog, Card, CardHeader, CardContent, CardActions,
  Button, TextField, CircularProgress, Box,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
// importa tu cliente y tu componente de avatares
// import clientManager from '@/lib/clientManager';
import AvatarGroupTight from '@/components/App/AvatarGroupTight';

// --- helper: "hace 2 días" con Intl.RelativeTimeFormat
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

export default function SpaceListItem({ item, onDelete }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [menuEl, setMenuEl] = useState(null);
  const menuOpen = Boolean(menuEl);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [loading, setLoading] = useState(false);

  const relative = useMemo(() => timeFromNow(item.event_date), [item.event_date]);
  const absolute = useMemo(
    () => new Date(item.event_date).toLocaleDateString('es-MX', { dateStyle: 'medium' }),
    [item.event_date]
  );

  const enableSpaceActions = true;

  const handleRowClick = () => router.push(`/space/${item.id}`);
  const handleMenuClick = (e) => setMenuEl(e.currentTarget);
  const handleMenuClose = () => setMenuEl(null);

  const handleSpaceDeletion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientManager.delete(`/space/${item.id}`);
      enqueueSnackbar('Espacio borrado exitosamente', { variant: 'success' });
      setOpenConfirm(false);
      setConfirmName('');
      onDelete?.(item);
    } catch (error) {
      enqueueSnackbar(`Hubo un error al eliminar el espacio: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          enableSpaceActions && item?.member_role === 'owner' ? (
            <>
              <IconButton
                edge="end"
                aria-label="acciones del espacio"
                onClick={handleMenuClick}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <MoreHorizIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={menuEl} open={menuOpen} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    setOpenConfirm(true);
                  }}
                >
                  <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                  Borrar
                </MenuItem>
              </Menu>
            </>
          ) : null
        }
      >
        <ListItemButton
          onClick={handleRowClick}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1.5,
            '&:hover': { backgroundColor: (t) => t.palette.action.hover },
          }}
        >
          {/* Avatar/ícono de fecha */}
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: 'transparent',
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <EventIcon fontSize="small" />
            </Avatar>
          </ListItemAvatar>

          {/* Contenido principal */}
          <ListItemText
            primary={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mr: 1 }}>
                  {item.name}
                </Typography>
                <Chip
                  size="small"
                  variant="outlined"
                  label={absolute}
                  sx={{ borderColor: 'divider' }}
                />
                <Typography variant="caption" color="text.secondary">
                  • {relative}
                </Typography>
              </Stack>
            }
            secondary={
              <Box mt={0.5}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  title={item.description}
                  sx={{ maxWidth: { xs: '100%', md: 640 } }}
                >
                  {item.description}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                  <AvatarGroupTight members={item?.members} size="small" />
                </Stack>
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider component="li" />

      {/* Confirmación de borrado (igual a tu Card) */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} fullWidth maxWidth="sm">
        <form onSubmit={handleSpaceDeletion}>
          <Card elevation={1}>
            <CardHeader title={'¿Seguro de que deseas borrar este espacio?'} />
            <CardContent>
              <Stack spacing={3}>
                <Typography>
                  Se borrará toda la información relacionada y se perderán los tickets para todos dentro del espacio.
                </Typography>
                <Typography>
                  Escribe: <strong>{item.name}</strong>
                </Typography>
                <TextField
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
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
                disabled={loading || confirmName !== item.name}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {loading ? 'Borrando...' : 'Borrar espacio'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => {
                  setOpenConfirm(false);
                  setConfirmName('');
                }}
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