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
  Skeleton, CardActions,
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
        width: '250px',
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={onClick} aria-label={`Abrir ticket de ${place}`}>
        {/* Contenido: papel térmico del ticket */}
        <CardContent sx={{ p: 2 }}>
          {loading ? (
            <Stack spacing={1.2}>
              <Skeleton width="70%" />
              <Skeleton width="50%" />
              <Skeleton variant="rectangular" height={100} />
            </Stack>
          ) : (
            <Box
              sx={{
                position: "relative",
                mx: "auto",
                bgcolor: "#fff",
                color: "text.primary",
                borderRadius: 1,
                p: 1.5,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                letterSpacing: ".01em",
                // Dientes tipo “perforación”
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 8,
                  background:
                    "radial-gradient(circle at 8px 8px, transparent 8px, #fff 8px) top left / 16px 16px repeat-x",
                },
                "&::before": { top: -8 },
                "&::after": { bottom: -8, transform: "scaleY(-1)" },
              }}
            >
              {/* Encabezado: lugar + fecha */}
              <Box sx={{ textAlign: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: 800, letterSpacing: ".08em" }} variant="subtitle2" noWrap>
                  {(place || "COMERCIO").toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {uploadedAt ? formatDate(uploadedAt) : "—"}
                </Typography>
              </Box>

              {/* Línea punteada */}
              <Box
                sx={{
                  my: 1,
                  height: 1,
                  background:
                    "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",
                }}
              />

              {/* Meta rápida: items / participantes (si existen) */}
              {(typeof itemsCount === "number" || typeof participantsCount === "number") && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    rowGap: 0.5,
                    mb: 1,
                  }}
                >
                  {typeof itemsCount === "number" && (
                    <>
                      <Typography variant="caption" color="text.secondary">
                        ÍTEMS
                      </Typography>
                      <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 600 }}>
                        {itemsCount}
                      </Typography>
                    </>
                  )}
                  {typeof participantsCount === "number" && (
                    <>
                      <Typography variant="caption" color="text.secondary">
                        AMIGOS
                      </Typography>
                      <Typography variant="caption" sx={{ textAlign: "right", fontWeight: 600 }}>
                        {participantsCount}
                      </Typography>
                    </>
                  )}
                </Box>
              )}

              {/* Totales */}
              <Box sx={{ display: "grid", rowGap: 0.5 }}>
                <Row label="TOTAL" value={formatMoney(total, currency)} strong />
                {typeof totalWithTip === "number" && totalWithTip > total && (
                  <Row label="TOTAL C/ PROP." value={formatMoney(totalWithTip, currency)} />
                )}
              </Box>

              {/* Línea punteada */}
              <Box
                sx={{
                  my: 1,
                  height: 1,
                  background:
                    "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",
                }}
              />

              {/* Footer minimal: iconos/leyendas sutiles */}
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ color: "text.secondary" }}>
                <PlaceIcon sx={{ fontSize: 14 }} />
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <ReceiptLongIcon sx={{ fontSize: 14 }} />
              </Stack>

              {/* Barcode simulado */}
              <Box
                sx={{
                  mt: 1,
                  height: 28,
                  background:
                    "repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 4px)",
                  opacity: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "center", mt: 0.25, letterSpacing: "0.25em" }}
                color="text.secondary"
              >
                7  3  9  4  1  2  8  5
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/* Filas alineadas al estilo ticket */
function Row({ label, value, strong }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "baseline",
      }}
    >
      <Typography
        variant="body2"
        sx={{ letterSpacing: ".06em" }}
        color={strong ? "inherit" : "text.secondary"}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ textAlign: "right", fontWeight: strong ? 800 : 600 }}
      >
        {value}
      </Typography>
    </Box>
  );
}