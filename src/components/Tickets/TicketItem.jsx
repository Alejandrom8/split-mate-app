import React from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { fmtMoney } from "@/shared/utils";

export default function TicketItem({ item, currency, onEdit, onDelete }) {
  const qty = item.total_quantity ?? 0;
  const unit = item.unit_price != null ? fmtMoney(item.unit_price, currency) : "—";
  const total =
    item.total_price != null ? fmtMoney(item.total_price, currency) : "—";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        px: 2,
        py: 1.5,
        mb: 2,
        cursor: "pointer",
        borderColor: "divider",
        transition: "all .2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: 3,
        },
      }}
    >
      {/* fila superior: icono + nombre + acciones */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: "grey.100",
            color: "text.secondary",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            padding: 0.7,
          }}
        >
          <ShoppingCartOutlinedIcon fontSize="small" />
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, flex: 1, pr: 1, lineHeight: 1.2 }}
        >
          {item.name || "Ítem sin nombre"}
        </Typography>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit?.(item)}
              aria-label={`Editar ${item.name}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(item.id)}
              aria-label={`Eliminar ${item.name}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider sx={{ my: 1 }} />

      {/* fila de datos: izquierda cálculo, derecha total */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, sm: 2 }}
        sx={{ px: 3 }}
      >
        {/* cálculo */}
        <Stack direction="row" spacing={1.25} flexWrap="wrap" alignItems="baseline">
          <Typography variant="body2" color="text.secondary">
            Cantidad:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {qty}
          </Typography>

          <Typography variant="body2" color="text.disabled">
            ·
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Precio Unitario:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {unit}
          </Typography>
        </Stack>

        {/* total destacado */}
        <Box textAlign={{ xs: "left", sm: "right" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.25 }}
          >
            Total
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, lineHeight: 1 }}
          >
            {total}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}