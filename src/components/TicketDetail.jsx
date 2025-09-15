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
  Button, useTheme, useMediaQuery, CircularProgress,
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

export default function TicketDetail({
  ticket,
  onEdit,
  onShare,
  onSplit,
}) {
  const router = useRouter();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
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

        {/*<CardContent>*/}
        {/*  /!* Papel térmico del ticket *!/*/}
        {/*  <Box*/}
        {/*    sx={{*/}
        {/*      position: "relative",*/}
        {/*      mx: "auto",*/}
        {/*      maxWidth: 520,*/}
        {/*      bgcolor: "#fff",*/}
        {/*      color: "text.primary",*/}
        {/*      borderRadius: 1,*/}
        {/*      boxShadow: "0 1px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",*/}
        {/*      p: 2,*/}
        {/*      fontFamily:*/}
        {/*        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',*/}
        {/*      letterSpacing: ".01em",*/}
        {/*      // Dientes tipo “perforación”*/}
        {/*      "&::before, &::after": {*/}
        {/*        content: '""',*/}
        {/*        position: "absolute",*/}
        {/*        left: 0,*/}
        {/*        right: 0,*/}
        {/*        height: 10,*/}
        {/*        background:*/}
        {/*          "radial-gradient(circle at 10px 10px, transparent 10px, #fff 10px) top left / 20px 20px repeat-x",*/}
        {/*      },*/}
        {/*      "&::before": { top: -10 },*/}
        {/*      "&::after": {*/}
        {/*        bottom: -10,*/}
        {/*        transform: "scaleY(-1)",*/}
        {/*      },*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    /!* Encabezado *!/*/}
        {/*    <Box sx={{ textAlign: "center", mb: 1 }}>*/}
        {/*      <Typography*/}
        {/*        sx={{ fontWeight: 800, letterSpacing: ".08em" }}*/}
        {/*        variant="subtitle1"*/}
        {/*      >*/}
        {/*        {(establishment_name || "COMERCIO").toUpperCase()}*/}
        {/*      </Typography>*/}
        {/*      <Typography variant="caption" color="text.secondary">*/}
        {/*        {category || "Ticket"} · {ticket_date ? fmtDate(ticket_date) : "—"}*/}
        {/*      </Typography>*/}
        {/*    </Box>*/}

        {/*    /!* Divisor punteado *!/*/}
        {/*    <Box*/}
        {/*      sx={{*/}
        {/*        my: 1,*/}
        {/*        height: 1,*/}
        {/*        background:*/}
        {/*          "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    /!* Lista de ítems estilo ticket *!/*/}
        {/*    {items?.length > 0 ? (*/}
        {/*      <Box sx={{ display: "grid", rowGap: 0.5 }}>*/}
        {/*        {items.map((it, idx) => (*/}
        {/*          <Box*/}
        {/*            key={idx}*/}
        {/*            sx={{*/}
        {/*              display: "grid",*/}
        {/*              gridTemplateColumns: "1fr auto auto",*/}
        {/*              columnGap: 1,*/}
        {/*              alignItems: "baseline",*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            <Typography variant="body2" noWrap title={it.name}>*/}
        {/*              {it.name || "—"}*/}
        {/*            </Typography>*/}
        {/*            <Typography*/}
        {/*              variant="body2"*/}
        {/*              sx={{ textAlign: "right", minWidth: 46 }}*/}
        {/*              color="text.secondary"*/}
        {/*            >*/}
        {/*              {it.total_quantity != null ? `x${it.total_quantity}` : ""}*/}
        {/*            </Typography>*/}
        {/*            <Typography*/}
        {/*              variant="body2"*/}
        {/*              sx={{ textAlign: "right", minWidth: 80, fontWeight: 600 }}*/}
        {/*            >*/}
        {/*              {it.total_price != null ? fmtMoney(it.total_price, currency) : "—"}*/}
        {/*            </Typography>*/}
        {/*          </Box>*/}
        {/*        ))}*/}
        {/*      </Box>*/}
        {/*    ) : (*/}
        {/*      <Typography variant="body2" color="text.secondary">*/}
        {/*        (Sin ítems detectados)*/}
        {/*      </Typography>*/}
        {/*    )}*/}

        {/*    /!* Divisor punteado *!/*/}
        {/*    <Box*/}
        {/*      sx={{*/}
        {/*        my: 1,*/}
        {/*        height: 1,*/}
        {/*        background:*/}
        {/*          "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    /!* Subtotales / impuestos / propina *!/*/}
        {/*    <Box sx={{ display: "grid", rowGap: 0.5 }}>*/}
        {/*      <Row label="SUBTOTAL" value={subtotal != null ? fmtMoney(subtotal, currency) : "—"} />*/}
        {/*      <Row label="IMPUESTOS" value={taxes != null ? fmtMoney(taxes, currency) : "—"} />*/}
        {/*      <Row label="PROPINA" value={tip != null ? fmtMoney(tip, currency) : "—"} />*/}
        {/*    </Box>*/}

        {/*    /!* Total y total con propina *!/*/}
        {/*    <Box*/}
        {/*      sx={{*/}
        {/*        my: 1,*/}
        {/*        height: 1,*/}
        {/*        background:*/}
        {/*          "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <Row*/}
        {/*      label="TOTAL"*/}
        {/*      value={total_amount != null ? fmtMoney(total_amount, currency) : "—"}*/}
        {/*      strong*/}
        {/*    />*/}
        {/*    {totalWithTip != null && totalWithTip > total_amount && (*/}
        {/*      <Row*/}
        {/*        label="TOTAL C/ PROP."*/}
        {/*        value={fmtMoney(totalWithTip, currency)}*/}
        {/*        strong*/}
        {/*      />*/}
        {/*    )}*/}

        {/*    /!* Pago, participantes, OCR *!/*/}
        {/*    <Box sx={{ mt: 1.5 }}>*/}
        {/*      <Typography variant="caption" color="text.secondary">*/}
        {/*        PAGO: {paymentMethod || "—"}*/}
        {/*      </Typography>*/}
        {/*      <br />*/}
        {/*      <Typography variant="caption" color="text.secondary">*/}
        {/*        PARTICIPANTES:{" "}*/}
        {/*        {participants?.length*/}
        {/*          ? participants.map((p) => p.name).join(", ")*/}
        {/*          : "—"}*/}
        {/*      </Typography>*/}
        {/*      {typeof ocrConfidence === "number" && (*/}
        {/*        <>*/}
        {/*          <br />*/}
        {/*          <Typography variant="caption" color="text.secondary">*/}
        {/*            CONF. OCR: {(ocrConfidence * 100).toFixed(0)}%*/}
        {/*          </Typography>*/}
        {/*        </>*/}
        {/*      )}*/}
        {/*    </Box>*/}

        {/*    /!* Notas (opcional) *!/*/}
        {/*    {notes && (*/}
        {/*      <>*/}
        {/*        <Box*/}
        {/*          sx={{*/}
        {/*            my: 1,*/}
        {/*            height: 1,*/}
        {/*            background:*/}
        {/*              "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",*/}
        {/*          }}*/}
        {/*        />*/}
        {/*        <Typography variant="caption" sx={{ whiteSpace: "pre-wrap" }}>*/}
        {/*          NOTAS: {notes}*/}
        {/*        </Typography>*/}
        {/*      </>*/}
        {/*    )}*/}

        {/*    /!* Barcode simulado *!/*/}
        {/*    <Box*/}
        {/*      sx={{*/}
        {/*        mt: 2,*/}
        {/*        height: 44,*/}
        {/*        background:*/}
        {/*          "repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 4px)",*/}
        {/*        opacity: 0.6,*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <Typography*/}
        {/*      variant="caption"*/}
        {/*      sx={{ display: "block", textAlign: "center", mt: 0.5, letterSpacing: "0.25em" }}*/}
        {/*    >*/}
        {/*      7  3  9  4  1  2  8  5*/}
        {/*    </Typography>*/}

        {/*    /!* Footer mini (RFC ficticio / dirección) *!/*/}
        {/*    <Box sx={{ textAlign: "center", mt: 1 }}>*/}
        {/*      <Typography variant="caption" color="text.secondary">*/}
        {/*        RFC: XAXX010101000*/}
        {/*      </Typography>*/}
        {/*      <br />*/}
        {/*      <Typography variant="caption" color="text.secondary">*/}
        {/*        Gracias por su compra*/}
        {/*      </Typography>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*</CardContent>*/}

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