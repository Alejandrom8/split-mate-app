import * as React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Divider,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Button, useTheme, useMediaQuery, CircularProgress, Dialog, DialogTitle, DialogActions, DialogContent,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import {fmtDate, fmtMoney} from "@/shared/utils";
import {TICKET_STATUS_MAP} from "@/shared/constants";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TicketItem from "@/components/Tickets/TicketItem";
import {useState} from "react";
import {useSnackbar} from "notistack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SpaceSelector from "@/components/Form/SpaceSelector";
import TicketDropzone from "@/components/Tickets/TicketDropzone";
import FileCard from "@/components/Form/FIleCard";

export default function TicketDetail({
  ticket,
  onEdit,
  onShare,
  onSplit,
}) {
  const {
    picture,
    establishment_name,
    ticket_date,
    total_amount,
    subtotal,
    taxes,
    tip,
    totalWithTip,
    currency = "MXN",
    items = [],
    participants = [],
    validation_status = 'hidden',
    notes,
    paymentMethod,   // 'Tarjeta', 'Efectivo', etc.
    category,        // 'Restaurante', 'Super', etc.
    ocrConfidence,   // 0-1
  } = ticket || {};
  const router = useRouter();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return <Stack spacing={1}>
      <Box sx={{ py: 1 }}>
        <Button
          onClick={() => router.back()}
          startIcon={<ArrowBackIcon />}
          variant="text"
          sx={{ color: "text.primary" }}
        >
          Regresar
        </Button>
      </Box>
      <Card variant="outlined">
        <CardHeader
          sx={{ my: 2 }}
          avatar={<ReceiptLongIcon />}
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={800} noWrap>
                {establishment_name || "—"}
              </Typography>
              {validation_status && (
                <Chip
                  size="small"
                  color={TICKET_STATUS_MAP[validation_status]?.color || "default"}
                  label={TICKET_STATUS_MAP[validation_status]?.label || validation_status}
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
                  {ticket_date ? fmtDate(ticket_date) : "—"}
                </Typography>
              </Stack>
            </Stack>
          }
        />

        <Divider />

        <CardContent>
          {
            items?.map((it, index) => (
              <TicketItem
                item={it} key={index}
                onEdit={() => console.log('Edit item')}
                onDelete={() => console.log('Delete item')}
              />
            ))
          }
          <Box sx={{ mb: '150px' }}/>
        </CardContent>

        {
          isSm && <Card
            sx={{
              width: '93vw',
              position: 'fixed',
              bottom: 30,
              left: 'calc(50vw - (93vw / 2))',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'primary.main',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  my: 1,
                  height: 1,
                  background:
                    "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",
                }}
              />
              <Row
                label="TOTAL"
                value={total_amount != null ? fmtMoney(total_amount, currency) : "—"}
                strong
              />
              {totalWithTip != null && totalWithTip > total_amount && (
                <Row
                  label="TOTAL C/ PROP."
                  value={fmtMoney(totalWithTip, currency)}
                  strong
                />
              )}
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Publicar ticket
              </Button>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
              >
                Guardar y regresar
              </Button>
            </CardActions>
          </Card>
        }

        {
          !isSm && <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
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
        }
      </Card>
  </Stack>;
}

/* Sub-componente para filas de totales alineadas tipo ticket */
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