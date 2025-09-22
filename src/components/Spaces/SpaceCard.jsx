import React, {useMemo, useState} from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardContent, IconButton, MenuItem,
  Stack,
  Typography,
  Menu, ListItemIcon, CardHeader,
  TextField, CardActions, Button,
  CircularProgress, Dialog,
} from "@mui/material";
import {useRouter} from "next/router";
import TodayIcon from '@mui/icons-material/Today';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import AvatarGroupTight from "@/components/App/AvatarGroupTight";
import {useSnackbar} from "notistack";
import clientManager from "@/shared/clientManager";

export default function SpaceCard({ item, onDelete }) {
  const enableSpaceActions = useMemo(() => true, [item]);
  const router = useRouter();
  const date = useMemo(() => new Date(item.event_date).toDateString(), []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openConfirmSpaceDeletion, setOpenConfirmSpaceDeletion] = useState(false);
  const [confirmSpaceName, setConfirmSpaceName] = useState();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    router.push(`/space/${item.id}`);
  };

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
    setConfirmSpaceName(null);
  };

  return <>
    <Card
      sx={{
        cursor: "pointer",
        borderColor: "divider",
        transition: "all .2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: 3,
        },
      }}
    >
        <CardContent>
          <Stack direction={'row'} justifyContent={'space-between'} sx={{ width: '100%', mb: 1 }} spacing={1} alignItems={'center'}>
            <Typography variant={'h5'} sx={{ flexGrow: 1 }} onClick={handleClick}>
              {item.name}
            </Typography>
            {
              item?.member_role === 'owner' && <Stack direction={'row'}>
                <IconButton
                  size={'small'}
                  onClick={handleMenuClick}
                  sx={{ border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <MoreHorizIcon fontSize={'small'} />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      style: {
                        maxHeight: 48 * 4.5,
                        width: '15ch',
                      },
                    },
                    list: {
                      'aria-labelledby': 'long-button',
                    },
                  }}
                >
                  <MenuItem onClick={() => setOpenConfirmSpaceDeletion(true)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize={'small'} />
                    </ListItemIcon>
                    Borrar
                  </MenuItem>
                </Menu>
              </Stack>
            }
          </Stack>
          <Stack spacing={2} onClick={handleClick}>
            <Box>
              <Stack direction={'row'} alignItems={'center'} sx={{ mb: 1 }} spacing={1}>
                <TodayIcon fontSize={'small'} color={'secondary'} />
                <Typography variant={'caption'} color={'textSecondary'}>
                  {date}
                </Typography>
              </Stack>
              <Typography color={'textSecondary'} sx={{ fontWeight: '500' }}>
                {item.description}
              </Typography>
            </Box>
            <Box>
              <Stack direction={'row'} spacing={2}>
                <AvatarGroupTight members={item?.members} size={'medium'}/>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
    </Card>
    <Dialog
      open={openConfirmSpaceDeletion}
      onClose={() => setOpenConfirmSpaceDeletion(false)}
      fullWidth maxWidth="sm"
    >
      <form onSubmit={handleSpaceDeletion}>
        <Card elevation={1}>
          <CardHeader title={'¿Seguro de que deseas borrar este espacio?'} />
          <CardContent>
            <Stack spacing={3}>
              <Typography>
                Se borrara toda la información relacionada y se perderán los tickets para todos dentro del espacio.
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
};