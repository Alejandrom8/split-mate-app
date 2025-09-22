import * as React from "react";
import {
  Card, CardContent, Chip, Stack, Typography,
  IconButton, Menu, MenuItem, ListItemIcon,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {fmtDate, fmtMoney} from "@/shared/utils";
import { TICKET_STATUS_MAP } from "@/shared/constants";
import {useMemo, useState} from "react";
import {useSnackbar} from "notistack";
import clientManager from "@/shared/clientManager";
import {useAuth} from "@/context/AuthContext";

export default function TicketRow({ ticket, onSelect, onDeleteCompleted }) {
  const [menuEl, setMenuEl] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const isOwner = useMemo(() => ticket?.owner?.user_id === user.id, [ticket]);

  const openMenu = (e) => {
    e.stopPropagation();
    setMenuEl(e.currentTarget);
  };
  const closeMenu = (e) => {
    e?.stopPropagation?.();
    setMenuEl(null);
  };
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    closeMenu();
    setConfirmOpen(true);
  };
  const handleCloseDialog = (e) => {
    if (loading) return;
    e?.stopPropagation?.();
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await clientManager.delete(`/tickets/${ticket?.id}`);
      enqueueSnackbar(`Ticket eliminado`, { variant: 'info' });
      setConfirmOpen(false);
      onDeleteCompleted?.();
    } catch (error) {
      enqueueSnackbar(`Error al borrar el ticket: ${error?.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const statusCfg = TICKET_STATUS_MAP[ticket?.validation_status] || {};
  const establishment = ticket?.establishment_name || "Ticket sin nombre";
  const ticketDate = fmtDate(ticket?.ticket_date);

  return (
    <>
      <Card
        variant="outlined"
        onClick={() => onSelect?.(ticket)}
        sx={{
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
        }}
      >
        <CardContent sx={{ pb: 2 }}>
          <Stack direction={'column'} spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
              {/* Izquierda: título + meta */}
              <Stack spacing={0.5} sx={{ minWidth: 0 /* para truncado */ }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                  title={establishment}
                >
                  {establishment}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {ticketDate}
                </Typography>
              </Stack>

              {/* Derecha: total + menú */}
              <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ flexShrink: 0 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>
                  {fmtMoney(ticket?.total_amount)}
                </Typography>

                {
                  isOwner && <>
                    <IconButton
                      aria-label="Más opciones"
                      onClick={openMenu}
                      edge="end"
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={menuEl}
                      open={Boolean(menuEl)}
                      onClose={closeMenu}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MenuItem onClick={handleDeleteClick}>
                        <ListItemIcon>
                          <DeleteOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        Borrar ticket
                      </MenuItem>
                    </Menu>
                  </>
                }
              </Stack>
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0}>
              <Chip
                size="small"
                color={statusCfg.color || "default"}
                label={statusCfg.label || ticket?.validation_status || "—"}
              />
              <Chip size="small" variant="outlined" label={`${ticket?.items_count ?? 0} ítems`} />
              <Chip size="small" variant="outlined" label={`${ticket?.participants_count ?? 0} amigos`} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Confirmación de borrado */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseDialog}
        onClick={(e) => e.stopPropagation()}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {`¿Estás seguro de que quieres borrar el ticket "${establishment}"?`}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Se perderán todos los items relacionados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={'small'} /> : <DeleteOutlineIcon />}
          >
            {loading ? 'Borrando ticket...' : 'Borrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}