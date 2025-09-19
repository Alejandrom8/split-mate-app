import React, {useMemo, useState} from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
  Stack,
  Tooltip,
  Divider, Dialog, CardHeader, CardActions, Button, CircularProgress, TextField, Checkbox, AvatarGroup, Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { fmtMoney } from "@/shared/utils";

export default function TicketItem({ item, selectable, selected, editable, currency, onCheck, onEdit, onDelete }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [itemName, setItemName] = useState(item?.name)
  const [itemQuantity, setItemQuantity] = useState(item?.total_quantity);
  const [itemUnitPrice, setItemUnitPrice] = useState(item?.unit_price);
  const itemTotal = useMemo(() => itemQuantity * itemUnitPrice, [itemQuantity, itemUnitPrice]);

  const qty = itemQuantity ?? 0;
  const unit = itemUnitPrice != null ? fmtMoney(itemUnitPrice, currency) : "—";
  const total =
    itemTotal != null ? fmtMoney(itemTotal, currency) : "—";


  const handleCancel = () => {
    setEditOpen(false);
    setDeleteOpen(false);
    setItemName(item?.name);
    setItemQuantity(item?.total_quantity);
    setItemUnitPrice(item?.unit_price);
  }

  const handleChange = (event) => {
    onCheck(item, event.target.checked);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onEdit({
      ...item,
      name: itemName,
      unit_price: itemUnitPrice,
      total_quantity: itemQuantity,
    })
      .then(() => {
        setEditOpen(false);
      })
      .catch(() => {
        handleCancel();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleDeleteItemSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onDelete(item.id)
      .then(() => {
        setDeleteOpen(false);
      })
      .catch(() => {
        handleCancel();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return <>
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
      onClick={() => onCheck(item, !selected)}
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
          {
            selectable && <Checkbox
              checked={selected}
              onChange={handleChange}
            />
          }
          {
            editable && <>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setEditOpen(true)}
                  aria-label={`Editar ${item.name}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeleteOpen(true)}
                  aria-label={`Eliminar ${item.name}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          }
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

    {
      editable && <>
        {/* Editar item */}
        <Dialog open={editOpen} onClose={handleCancel} fullWidth maxWidth="sm">
          <form onSubmit={handleEditSubmit}>
            <Card elevation={1}>
              <CardHeader title={'Editar item'} />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    type={'text'}
                    placeholder={'Nombre'}
                    fullWidth
                    label={'Nombre'}
                    hiddenLabel
                    variant={'outlined'}
                    disabled={loading}
                  />
                  <TextField
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                    type={'number'}
                    placeholder={'Nombre del item'}
                    fullWidth
                    hiddenLabel
                    variant={'outlined'}
                    label={'Cantidad'}
                    disabled={loading}
                  />
                  <TextField
                    value={itemUnitPrice}
                    onChange={(e) => setItemUnitPrice(e.target.value)}
                    type={'number'}
                    placeholder={'Precio unitario'}
                    fullWidth
                    hiddenLabel
                    variant={'outlined'}
                    label={'Precio unitario'}
                    disabled={loading}
                  />
                  <TextField
                    value={itemTotal}
                    type={'number'}
                    placeholder={'Total'}
                    fullWidth
                    hiddenLabel
                    variant={'outlined'}
                    label={'Total'}
                    disabled
                    helperText={'El total es calculado en base al precio unitario y a la cantidad'}
                  />
                </Stack>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </CardActions>
            </Card>
          </form>
        </Dialog>
        {/* Eliminar item */}
        <Dialog open={deleteOpen} onClose={handleCancel} fullWidth maxWidth="sm">
          <form onSubmit={handleDeleteItemSubmit}>
            <Card elevation={1}>
              <CardHeader title={'¿Deseas eliminar este item?'} />
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant={'h5'}>
                    {item.name}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {loading ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </CardActions>
            </Card>
          </form>
        </Dialog>
      </>
    }
  </>;
}