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
  Button,
  useTheme,
  useMediaQuery,
  Container, CircularProgress, Dialog, TextField, AvatarGroup, Avatar,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {fmtDate, fmtMoney} from "@/shared/utils";
import {TICKET_STATUS_MAP} from "@/shared/constants";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TicketItem from "@/components/Tickets/TicketItem";
import {useMemo, useState} from "react";
import {useSnackbar} from "notistack";
import clientManager from "@/shared/clientManager";
import AddIcon from "@mui/icons-material/Add";

export default function TicketDetail({
  selectable,
  editable,
  spaceId,
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
  const [items, setItems] = useState(ticket.items);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const itemsTotalSum = useMemo(() => items.reduce((ac, it) => ac + Number(it.total_price), 0), [items]);

  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitPrice, setItemUnitPrice] = useState(0);
  const itemTotal = useMemo(() => itemQuantity * itemUnitPrice, [itemQuantity, itemUnitPrice]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleUpdateItem = async (updatedItem) => {
    try {
      const result = await clientManager.put(`/tickets/${ticket.id}/items/${updatedItem.id}`, updatedItem);
      const newItem = result.data;
      setItems((prev) =>
        prev.map((it) => (it.id === newItem.id ? { ...it, ...newItem } : it))
      );
      enqueueSnackbar('Item actualizado', { variant: 'info' });
    } catch (error) {
      enqueueSnackbar('Error al actualizar el item', {variant: 'error'});
    }
  }

  const handleDeleteItem = async (deleteItemId) => {
    try {
      await clientManager.delete(`/tickets/${ticket.id}/items/${deleteItemId}`);
      const prevItems = items.slice();
      const index = prevItems.findIndex((it) => it.id === deleteItemId);
      prevItems.splice(index, 1);
      setItems(prevItems);
      enqueueSnackbar('Item eliminado', { variant: 'info' });
    } catch (error) {
      enqueueSnackbar('Error al eliminar el item', {variant: 'error'});
    }
  }

  const handlePublishTicket = async () => {
    setLoading(true);
    try {
      await clientManager.put(`/tickets/${ticket.id}/status`, { status: 'in_build' });
      enqueueSnackbar('Item publicado', { variant: 'success' });
      await router.push(`/space/${spaceId}`);
    } catch (error) {
      enqueueSnackbar(`Error al publicar el ticket: ${error.message}`, {variant: 'error'});
    } finally {
      setLoading(false);
    }
  }

  const handleCloseAddWindow = () => {
    setAddOpen(false);
    setItemName('');
    setItemQuantity(1);
    setItemUnitPrice(0);
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await clientManager.post(`/tickets/${ticket.id}/items`, {
        name: itemName,
        unit_price: itemUnitPrice,
        total_quantity: itemQuantity,
      });
      setItems((prev) => [result.data, ...prev]);
      enqueueSnackbar('Item agregado', { variant: 'success' });
      handleCloseAddWindow();
    } catch (error) {
      enqueueSnackbar('Error al agregar item', {variant: 'error'});
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelected = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleItemUnselected = (item) => {
    const prevItems = selectedItems.slice();
    const itemIndex = prevItems.findIndex(prevItem => prevItem.id === item.id);
    if (itemIndex === -1) return;
    prevItems.splice(itemIndex, 1);
    setSelectedItems(prevItems);
  };

  const handleItemCheck = (item, checked) => {
    if (checked) {
      handleItemSelected(item);
    } else {
      handleItemUnselected(item);
    }
  }

  const handleCancel = () => {
    router.push(`/space/${spaceId}`);
  };

  const handleAssignItems = async () => {
    setLoading(true);
    try {
      await clientManager.post(`/tickets/${ticket.id}/items/assign`, {
        items: selectedItems.map((it) => ({id: it.id, total_quantity: it.total_quantity}))
      });
      enqueueSnackbar('Items assignados', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al assignar los items', {variant: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return <Container spacing={1}>
      <Box sx={{ py: 1 }}>
        <Button
          onClick={handleCancel}
          startIcon={<ArrowBackIcon />}
          variant="text"
          sx={{ color: "text.primary" }}
        >
          Regresar
        </Button>
      </Box>
      {
        selectable && <Box sx={{ py: 3, px: 3 }}>
          <Typography variant={'h4'} textAlign={'center'}>
            Selecciona tus items
          </Typography>
        </Box>
      }
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card
          variant="outlined"
          sx={{ width: { xs: '100%', sm: '75vw', md: '60vw' } }}
        >
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
            action={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  // 🔹 en móviles, los avatares se hacen más chicos y pueden envolver
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  gap: { xs: 0.5, sm: 1 },
                  "& .MuiAvatar-root": {
                    width: { xs: 28, sm: 34 },
                    height: { xs: 28, sm: 34 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }
                  }
                }}
              >
                <AvatarGroup>
                  {
                    participants?.map((user, index) => (
                      <Avatar
                        key={index}
                        src={user?.profile_image_url}
                        alt={user?.username}
                        sx={{ width: 36, height: 36 }}
                      >
                        {user?.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    ))
                  }
                </AvatarGroup>
              </Box>
            }
            sx={{
              // 🔹 asegura que el header no colapse
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 }
            }}
          />

          <Divider />

          <CardContent>
            {
              editable && <Box p={2}>
                <Button
                  variant={'contained'}
                  color={'secondary'}
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => setAddOpen(true)}
                >
                  Agregar Item
                </Button>
              </Box>
            }
            {
              items?.map((it, index) => (
                <TicketItem
                  item={it}
                  key={index}
                  selectable={selectable}
                  selected={!!selectedItems.find(sIt => sIt.id === it.id)}
                  editable={editable}
                  onCheck={handleItemCheck}
                  onCreate={handleAddNewItem}
                  onEdit={handleUpdateItem}
                  onDelete={handleDeleteItem}
                />
              ))
            }
            <Box sx={{ mb: '150px' }}/>
            {/* Agregar item */}
            <Dialog open={addOpen} onClose={handleCloseAddWindow} fullWidth maxWidth="sm">
              <form onSubmit={handleAddNewItem}>
                <Card elevation={1}>
                  <CardHeader title={'Agregar item'} />
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
                      onClick={handleCloseAddWindow}
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
                      {loading ? 'Creando...' : 'Crear'}
                    </Button>
                  </CardActions>
                </Card>
              </form>
            </Dialog>
          </CardContent>

          {
            isSm && <Card
              sx={{
                width: '93vw',
                position: 'fixed',
                bottom: 30,
                left: 'calc(50vw - (93vw / 2))',
                borderWidth: 2,
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
                {
                 editable && <>
                    <Row
                      label="Total actualizado"
                      value={itemsTotalSum != null ? fmtMoney(itemsTotalSum, currency) : "—"}
                    />
                    <Row
                      label="TOTAL DEL TICKET"
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
                 </>
                }
                {
                  selectable && <>
                    <Row
                      label="Items seleccionados"
                      value={selectedItems.length}
                    />
                    <Row
                      label="Total seleccionado"
                      value={selectedItems.length ? fmtMoney(selectedItems.reduce((ac, it) => ac + Number(it.total_price), 0), currency) : 0}
                    />
                  </>
                }
              </CardContent>
              <CardActions>
                {
                  editable && <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      onClick={handlePublishTicket}
                      startIcon={loading && <CircularProgress />}
                    >
                      {loading ? 'Publicando...' : 'Publicar ticket'}
                    </Button>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      onClick={handleCancel}
                    >
                      Guardar y regresar
                    </Button>
                  </>
                }
                {
                  selectable && <>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                      onClick={handleAssignItems}
                      startIcon={loading && <CircularProgress />}
                    >
                      {loading ? 'Guardando...' : 'Actualizar items'}
                    </Button>
                  </>
                }
              </CardActions>
            </Card>
          }

          {
            !isSm && <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePublishTicket}
              >
                Publicar ticket
              </Button>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleCancel}
              >
                Guardar y salir
              </Button>
            </CardActions>
          }
        </Card>
      </Box>
  </Container>;
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