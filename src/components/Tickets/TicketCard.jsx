import * as React from "react";
import {
  Card, CardContent, Typography, Stack, Box,
  IconButton, Menu, MenuItem, ListItemIcon,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Grid, Chip
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";
import clientManager from "@/shared/clientManager";
import { fmtDateTime, fmtMoney } from "@/shared/utils";
import { TICKET_STATUS_MAP } from "@/shared/constants";

function digitsFromId(id = "") {
  // Extrae dígitos del UUID; si faltan, convierte letras a números básicos
  const onlyDigits = id.replace(/\D/g, "");
  if (onlyDigits.length >= 10) return onlyDigits.slice(-10);
  const mapped = id.replace(/-/g, "").split("").map(c => {
    if (/\d/.test(c)) return c;
    // a→1, b→2, ...
    const n = c.toLowerCase().charCodeAt(0) - 96;
    return String((n > 0 && n < 27) ? (n % 10) : 0);
  }).join("");
  return (onlyDigits + mapped).slice(-10).padStart(10, "0");
}

export default function TicketRow({ ticket, onSelect, onDeleteCompleted, tipPercent = 10 }) {
  const [menuEl, setMenuEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const isOwner = useMemo(() => ticket?.owner?.user_id === user?.id, [ticket, user]);

  const establishment = (ticket?.establishment_name || ticket?.name || "Ticket").toUpperCase();
  const ticketDate = fmtDateTime(ticket?.ticket_date); // ej. "28 ago 2025"
  const series = digitsFromId(ticket?.id);
  const total = Number(ticket?.total_amount ?? 0);
  const statusCfg = TICKET_STATUS_MAP[ticket?.validation_status] || {};


  const openMenu = (e) => { e.stopPropagation(); setMenuEl(e.currentTarget); };
  const closeMenu = (e) => { e?.stopPropagation?.(); setMenuEl(null); };
  const handleDeleteClick = (e) => { e.stopPropagation(); closeMenu(); setConfirmOpen(true); };
  const handleCloseDialog = (e) => { if (loading) return; e?.stopPropagation?.(); setConfirmOpen(false); };
  const handleConfirmDelete = async (e) => {
    e.stopPropagation(); setLoading(true);
    try {
      await clientManager.delete(`/tickets/${ticket?.id}`);
      enqueueSnackbar(`Ticket eliminado`, { variant: "info" });
      setConfirmOpen(false);
      onDeleteCompleted?.();
    } catch (error) {
      enqueueSnackbar(`Error al borrar el ticket: ${error?.message}`, { variant: "error" });
    } finally { setLoading(false); }
  };

  return (
    <>
      <Card
        onClick={() => onSelect?.(ticket)}
        sx={(theme) => ({
          cursor: "pointer",
          borderRadius: 0.7,
          overflow: "hidden",
          boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02))"
            : "linear-gradient(0deg, #fff, #fff)",
          "&:hover": { boxShadow: "0 18px 48px rgba(0,0,0,0.15)" }
        })}
      >
        <CardContent sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 2 }, position: 'relative' }}>
          {/* Encabezado */}
          {/* Menú (arriba a la derecha como acción secundaria) */}
          <Box sx={{ display: 'flex', justifyContent: 'right', position: 'absolute', top: 2, right: 5  }}>
            {isOwner && (
              <IconButton
                size="small"
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                onClick={openMenu}
                aria-label="Más opciones"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreVertIcon fontSize="small"/>
              </IconButton>
            )}
          </Box>

          <Stack alignItems="center" spacing={0.5} sx={{ textAlign: "center" }}>
            <Typography 
              variant="subtitle1" 
              fontWeight={900}
              letterSpacing={1}
              fontSize={'1rem'}
              noWrap
              width={'90%'}
              title={establishment}
            >
              {establishment}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ticketDate}
            </Typography>
          </Stack>

          {/* Tabla de valores */}
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={{ xs: 0, md: 0.5 }} alignItems="center">
              <Grid size={5}>
                <Typography color="text.secondary" sx={{ letterSpacing: 1, fontSize: '12px' }}>ESTADO</Typography>
              </Grid>
              <Grid size={7} textAlign="right">
                <Chip
                  size="small"
                  color={statusCfg.color || "default"}
                  label={statusCfg.label || ticket?.validation_status || "—"}
                />
              </Grid>

              <Grid size={7}>
                <Typography color="text.secondary" sx={{ letterSpacing: 1, fontSize: '12px' }}>ÍTEMS</Typography>
              </Grid>
              <Grid size={5} textAlign="right">
                <Typography fontWeight={700}>{ticket?.items_count ?? 0}</Typography>
              </Grid>

              <Grid size={7}>
                <Typography color="text.secondary" sx={{ letterSpacing: 1, fontSize: '12px' }}>AMIGOS</Typography>
              </Grid>
              <Grid size={5} textAlign="right">
                <Typography fontWeight={700}>{ticket?.participants_count ?? 0}</Typography>
              </Grid>

              <Grid size={5}>
                <Typography sx={{ letterSpacing: 1, fontSize: '12px' }}>TOTAL</Typography>
              </Grid>
              <Grid size={7} textAlign="right">
                <Typography fontWeight={900} sx={{ fontVariantNumeric: "tabular-nums", fontSize: '0.9rem' }}>
                  {fmtMoney(total)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Código de barras */}
          <Box
            aria-hidden
            sx={(theme) => ({
              mt: 2.25,
              height: 20,
              background: `repeating-linear-gradient(
                90deg,
                ${theme.palette.text.primary} 0px,
                ${theme.palette.text.primary} 2px,
                transparent 2px,
                transparent 6px
              )`,
              opacity: 0.5
            })}
          />

          {/* Serie */}
          <Typography
            variant="caption"
            display="block"
            align="center"
            sx={{ mt: 1, letterSpacing: 6, color: "text.secondary" }}
          >
            {series}
          </Typography>
        </CardContent>
      </Card>

      {/* Menú */}
      <Menu
        anchorEl={menuEl}
        open={Boolean(menuEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          style: { padding: 0, margin: 0 }
        }}
      >
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" /></ListItemIcon>
          Borrar ticket
        </MenuItem>
      </Menu>

      {/* Confirmación de borrado */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseDialog}
        onClick={(e) => e.stopPropagation()}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{`¿Borrar el ticket "${ticket?.establishment_name || ticket?.name}"?`}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Se perderán todos los ítems relacionados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size="small" /> : <DeleteOutlineIcon />}
          >
            {loading ? "Borrando..." : "Borrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}