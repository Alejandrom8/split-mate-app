import * as React from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Divider,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";

const fmtMoney = (n, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(n);

const fmtDate = (d) =>
  new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" })
    .format(typeof d === "string" ? new Date(d) : d);

export default function TicketDetail({
  ticket,
  onEdit,
  onShare,
  onSplit,
}) {
  const {
    picture,
    place,
    uploadedAt,
    total,
    subtotal,
    taxes,
    tip,
    totalWithTip,
    currency = "MXN",
    items = [],
    participants = [],
    status = "ready", // pending | processing | ready | error
    notes,
    paymentMethod,   // 'Tarjeta', 'Efectivo', etc.
    category,        // 'Restaurante', 'Super', etc.
    ocrConfidence,   // 0-1
  } = ticket || {};

  const statusMap = {
    ready: { label: "OCR listo", color: "success" },
    processing: { label: "Procesando", color: "warning" },
    pending: { label: "Pendiente", color: "warning" },
    error: { label: "Error", color: "error" },
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3} alignItems="stretch">
        {/* Panel izquierdo: Información */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardHeader
              avatar={<ReceiptLongIcon />}
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={800} noWrap>
                    {place || "—"}
                  </Typography>
                  {status && (
                    <Chip
                      size="small"
                      color={statusMap[status]?.color || "default"}
                      label={statusMap[status]?.label || status}
                    />
                  )}
                </Stack>
              }
              subheader={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PlaceIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {category || "Sin categoría"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {uploadedAt ? fmtDate(uploadedAt) : "—"}
                    </Typography>
                  </Stack>
                </Stack>
              }
            />

            <Divider />

            <CardContent>
              {/* Resumen de totales */}
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>{subtotal != null ? fmtMoney(subtotal, currency) : "—"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Impuestos</Typography>
                  <Typography>{taxes != null ? fmtMoney(taxes, currency) : "—"}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Propina</Typography>
                  <Typography>{tip != null ? fmtMoney(tip, currency) : "—"}</Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {total != null ? fmtMoney(total, currency) : "—"}
                  </Typography>
                </Stack>

                {totalWithTip != null && totalWithTip > total && (
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="text.secondary">Total con propina</Typography>
                    <Typography fontWeight={700}>{fmtMoney(totalWithTip, currency)}</Typography>
                  </Stack>
                )}
              </Stack>

              {/* Sección extra: participantes & método de pago */}
              <Divider sx={{ my: 2 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Stack flex={1} spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Participantes
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {participants?.length
                      ? participants.map((p) => (
                          <Chip key={p.id || p.name} size="small" icon={<GroupsIcon />} label={p.name} />
                        ))
                      : <Typography variant="body2">—</Typography>}
                  </Stack>
                </Stack>

                <Stack flex={1} spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Pago & OCR
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {paymentMethod && <Chip size="small" label={paymentMethod} variant="outlined" />}
                    {typeof ocrConfidence === "number" && (
                      <Chip
                        size="small"
                        label={`Confianza OCR ${(ocrConfidence * 100).toFixed(0)}%`}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>

              {/* Ítems detectados (resumen) */}
              {items?.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ítems detectados ({items.length})
                  </Typography>
                  <List dense disablePadding>
                    {items.slice(0, 5).map((it, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemText
                          primary={it.name || "—"}
                          secondary={it.qty != null ? `x${it.qty}` : undefined}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {it.total != null ? fmtMoney(it.total, currency) : "—"}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  {items.length > 5 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      + {items.length - 5} más en el detalle…
                    </Typography>
                  )}
                </>
              )}

              {/* Notas */}
              {notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notas
                  </Typography>
                  <Typography variant="body2">{notes}</Typography>
                </>
              )}
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Editar">
                  <IconButton onClick={onEdit}><EditIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Compartir">
                  <IconButton onClick={onShare}><ShareIcon /></IconButton>
                </Tooltip>
              </Stack>
              <Button variant="contained" onClick={onSplit}>
                Dividir gastos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Panel derecho: Imagen del ticket */}
        <Grid item xs={12} md={6}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              position: { md: "sticky" },
              top: { md: 24 },
              overflow: "hidden",
            }}
          >
            <CardHeader
              title="Imagen del ticket"
              subheader="Vista de alta calidad"
              action={
                picture ? (
                  <Tooltip title="Descargar imagen">
                    <IconButton component="a" href={picture} download target="_blank" rel="noopener noreferrer">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                ) : null
              }
            />
            <Divider />
            {picture ? (
              <CardMedia
                component="img"
                image={picture}
                alt={`Ticket - ${place || "comercio"}`}
                sx={{ maxHeight: { xs: 420, md: "calc(100vh - 240px)" }, objectFit: "contain", bgcolor: "background.default" }}
              />
            ) : (
              <Box
                sx={{
                  height: { xs: 320, md: "calc(100vh - 240px)" },
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "background.default",
                }}
              >
                <Typography color="text.secondary">Sin imagen</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}