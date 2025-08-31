import * as React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Skeleton,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const formatMoney = (value, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(value);

const formatDate = (d) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof d === "string" ? new Date(d) : d);

const statusColor = {
  pending: "warning",
  processing: "warning",
  ready: "success",
  error: "error",
};

export default function TicketCard({
  picture,
  place,
  uploadedAt,
  total,
  totalWithTip,
  currency = "MXN",
  status = "ready",
  itemsCount,
  participantsCount,
  onClick,
  loading = false,
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        "&:hover": { boxShadow: 10, borderColor: "divider" },
      }}
    >
      <CardActionArea onClick={onClick} aria-label={`Abrir ticket de ${place}`}>
        {/* Imagen */}
        <Box sx={{ position: "relative" }}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={140} />
          ) : (
            <CardMedia
              component="img"
              image={picture || "/placeholder-ticket.jpg"}
              alt={`Foto del ticket en ${place}`}
              sx={{
                height: 140,
                objectFit: "cover",
                filter: picture ? "none" : "grayscale(1)",
                bgcolor: "background.default",
              }}
            />
          )}

          {!loading && (
            <Chip
              size="small"
              color={statusColor[status]}
              label={
                status === "ready"
                  ? "OCR listo"
                  : status === "processing"
                  ? "Procesando"
                  : status === "pending"
                  ? "Pendiente"
                  : "Error"
              }
              sx={{ position: "absolute", top: 8, left: 8, backdropFilter: "blur(6px)" }}
            />
          )}
        </Box>

        {/* Contenido */}
        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1}>
            {/* Lugar */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <PlaceIcon fontSize="small" />
              {loading ? (
                <Skeleton width={160} />
              ) : (
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {place}
                </Typography>
              )}
            </Stack>

            {/* Fecha */}
            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
              <AccessTimeIcon fontSize="small" />
              {loading ? (
                <Skeleton width={120} />
              ) : (
                <Typography variant="body2">{formatDate(uploadedAt)}</Typography>
              )}
            </Stack>

            <Divider sx={{ my: 1 }} />

            {/* Total */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <ReceiptLongIcon fontSize="small" />
                {loading ? (
                  <Skeleton width={80} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                )}
              </Stack>

              {loading ? (
                <Skeleton width={80} />
              ) : (
                <Typography variant="subtitle1" fontWeight={700}>
                  {formatMoney(total, currency)}
                </Typography>
              )}
            </Stack>

            {/* Total con propina */}
            {typeof totalWithTip === "number" && totalWithTip > total && (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Con propina
                </Typography>
                {loading ? (
                  <Skeleton width={80} />
                ) : (
                  <Typography variant="body2" fontWeight={600}>
                    {formatMoney(totalWithTip, currency)}
                  </Typography>
                )}
              </Stack>
            )}

            {/* Extras opcionales */}
            <Stack direction="row" spacing={1} mt={1}>
              {typeof itemsCount === "number" && (
                <Chip size="small" variant="outlined" label={`${itemsCount} ítems`} />
              )}
              {typeof participantsCount === "number" && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${participantsCount} amigos`}
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}