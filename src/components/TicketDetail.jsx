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
  Container, CircularProgress,
  Dialog, TextField, AvatarGroup,
  Avatar, IconButton, Tooltip, Collapse, Grow,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {fmtDate, fmtMoney} from "@/shared/utils";
import {TICKET_STATUS_MAP} from "@/shared/constants";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TicketItem from "@/components/Tickets/TicketItem";
import {useEffect, useMemo, useState} from "react";
import {useSnackbar} from "notistack";
import clientManager from "@/shared/clientManager";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AvatarGroupTight from "@/components/App/AvatarGroupTight";
import DatePicker from "@/components/Form/DatePicker";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function TicketDetail({
                                       selectable,
                                       editable,
                                       spaceId,
                                       ticket,
                                     }) {
  const {
    image_url,
    currency = "MXN",
    validation_status = 'hidden',
  } = ticket || {};
  const router = useRouter();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [items, setItems] = useState(ticket.items);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const itemsTotalSum = useMemo(() => items.reduce((ac, it) => ac + Number(it.total_price), 0), [items]);

  /** TICKET FIELDS */
  const [ticketEstablishmentName, setTicketEstablishmentName] = useState(ticket?.establishment_name || '');
  const [ticketDate, setTicketDate] = useState(new Date(ticket?.ticket_date));
  const [ticketTotal, setTicketTotal] = useState(ticket?.total_amount || 0);

  /** EDIT TICKET FIELDS */
  const [editTicketEstablishmentName, setEditTicketEstablishmentName] = useState(ticketEstablishmentName);
  const [editTicketDate, setEditTicketDate] = useState(ticketDate);
  const [editTicketTotal, setEditTicketTotal] = useState(ticketTotal);

  /** EDIT ITEM FIELDS */
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitPrice, setItemUnitPrice] = useState(0);
  const itemTotal = useMemo(() => itemQuantity * itemUnitPrice, [itemQuantity, itemUnitPrice]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [showSelectedItems, setShowSelectedItems] = useState(false);

  const toggleShowSelectedItems = () => setShowSelectedItems(!showSelectedItems);

  const totalSumIsCorrect = useMemo(() => Number(ticketTotal) === Number(itemsTotalSum), [ticketTotal, itemsTotalSum]);

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

  const handleCloseEditWindow = () => {
    setEditOpen(false);
    setEditTicketTotal(ticketTotal);
    setEditTicketDate(ticketDate);
    setEditTicketEstablishmentName(ticketEstablishmentName);
  };

  const handleEditTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientManager.put(`/tickets/${ticket.id}`, {
        establishment_name: editTicketEstablishmentName,
        ticket_date: editTicketDate.toISOString().split("T")[0],
        total_amount: editTicketTotal,
      });
      enqueueSnackbar('Ticket actualizado', { variant: 'info' });
      setTicketEstablishmentName(editTicketEstablishmentName);
      setTicketDate(editTicketDate);
      setTicketTotal(editTicketTotal);
      setEditOpen(false);
    } catch (error) {
      enqueueSnackbar('Error al editar el ticket', {variant: 'error'});
    } finally {
      setLoading(false);
    }
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
    const prevItems = selectedItems.slice();
    const itemIndex = prevItems.findIndex(it => it.id === item.id);
    if (itemIndex === -1) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      prevItems[itemIndex] = item;
      setSelectedItems(prevItems);
    }
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
      enqueueSnackbar('Items asignados', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error al asignar los items', {variant: 'error'});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItems.length === 0) {
      setShowSelectedItems(false);
    }
  }, [selectedItems]);

  return <Container spacing={1}>
    <Box sx={{ py: 4 }}>
      <Typography variant={'h4'} textAlign={'center'}>
        {selectable && 'Selecciona tus items'}
        {editable && 'Ajusta tu ticket'}
      </Typography>
    </Box>
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card
        variant="outlined"
        sx={{
          width: { xs: '100%', sm: '75vw', md: '50vw' },
          mb: '22vh'
        }}
      >
        <CardHeader
          sx={{
            gap: { xs: 1, sm: 0 }
          }}
          avatar={
            image_url ? (
              <Box
                component="button"
                onClick={(e) => { e.stopPropagation(); setImageOpen(true); }}
                aria-label="Ver imagen del ticket"
                title="Ver imagen del ticket"
                sx={{
                  p: 0,
                  border: 0,
                  background: "none",
                  cursor: "zoom-in",
                  lineHeight: 0,
                  borderRadius: 1.5,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={image_url}
                  alt="Ticket"
                  sx={{
                    width: 44,
                    height: 44,
                    objectFit: "cover",
                    display: "block",
                    borderRadius: 1.5,
                    boxShadow: 1,
                  }}
                />
              </Box>
            ) : (
              <ReceiptLongIcon />
            )
          }
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={800} noWrap>
                {String(ticketEstablishmentName)}
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
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {fmtDate(ticketDate)}
                </Typography>
              </Stack>
              {/* Avatares de participantes */}
              {/*<AvatarGroupTight members={participants} size={'small'} />*/}
            </Stack>
          }
          action={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
              }}
              onClick={(e) => e.stopPropagation()} // evita que el click dispare acciones del Card
            >
              {/* BOTÓN EDITAR (esquina superior derecha) */}
              {editable && (
                <Tooltip title={'Editar ticket'}>
                  <IconButton
                    aria-label="Editar ticket"
                    onClick={() => setEditOpen(true)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          }
        />

        <Divider />

        <CardContent sx={{ px: 1.5 }}>
          {
            editable && <Box sx={{ mb: 3 }}>
              <Button
                variant={'outlined'}
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
        </CardContent>
      </Card>
    </Box>

    {/** TARJETA DE ACCIONES  */}
    <Card
      sx={{
        width: { xs: '100vw', md: '50vw' },
        position: 'fixed',
        //bottom: 30,
        left: { xs: 0, md: 'calc(50vw - (50vw / 2))' },
        bottom: 0,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        boxShadow: "0 -8px 20px rgba(11,18,32,0.10)",
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        // borderTopWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'primary.main',
      }}
    >
      <CardContent>
        {
          editable && <>
            <Row
              label="Suma de los items"
              value={fmtMoney(itemsTotalSum, currency)}
            />
            <Row
              label="TOTAL"
              value={fmtMoney(ticketTotal, currency)}
              strong
              primaryStyles={{
                fontWeight: 'bold'
              }}
              secondaryStyles={{
                color: totalSumIsCorrect ? 'primary.main' : 'error.main',
              }}
            />
            {
              !totalSumIsCorrect && (
                <Typography variant={'caption'} sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  <strong>WARN</strong>: Corrige los datos de los items para que cuadren con la suma final del ticket
                </Typography>
              )
            }
          </>
        }
        {
          selectable && <>
            <Row
              label={
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography variant="body2">Items Seleccionados</Typography>
                  {
                    selectedItems.length > 0 && <Tooltip title={'Mostrar Items'}>
                      <IconButton size={'small'} onClick={toggleShowSelectedItems}>
                        {
                          showSelectedItems
                            ? <KeyboardArrowUpIcon fontSize={'small'} />
                            : <KeyboardArrowDownIcon fontSize={'small'} />
                        }
                      </IconButton>
                    </Tooltip>
                  }
                </Stack>
              }
              value={selectedItems.length ? selectedItems.reduce((ac, it) => ac + Number(it.total_quantity), 0) : 0}
            />
            <Collapse in={selectedItems?.length > 0 && showSelectedItems}>
              {
                selectedItems.map((sItem) => (
                  <Row
                    key={sItem.id}
                    label={sItem.name}
                    value={Math.floor(Number(sItem.total_quantity))}
                    primaryStyles={{
                      color: '#777'
                    }}
                    secondaryStyles={{
                      color: '#777'
                    }}
                  />
                ))
              }
              <Box sx={{ mb: 2 }} />
            </Collapse>
            <Row
              label="Total"
              value={selectedItems.length ? fmtMoney(selectedItems.reduce((ac, it) => ac + (Number(it.unit_price) * Number(it.total_quantity)), 0), currency) : 0}
              strong
              primaryStyles={{
                fontWeight: 'bold'
              }}
              secondaryStyles={{
                color: 'primary.main',
              }}
            />
          </>
        }
      </CardContent>
      <CardActions sx={{ pb: 2 }}>
        {
          editable && <>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={handleCancel}
            >
              Regresar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !totalSumIsCorrect}
              onClick={handlePublishTicket}
              startIcon={loading && <CircularProgress size={'small'} />}
            >
              {loading ? 'Publicando...' : 'Publicar ticket'}
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

    {/* Abrir Imagen */}
    <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="md" fullWidth>
      <Box sx={{ position: "relative" }}>
        <IconButton
          aria-label="Cerrar"
          onClick={() => setImageOpen(false)}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          component="img"
          src={image_url ?? ""}
          alt="Ticket grande"
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </Box>
    </Dialog>
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
    {/* Editar ticket */}
    <Dialog open={editOpen} onClose={handleCloseEditWindow} fullWidth maxWidth="sm">
      <form onSubmit={handleEditTicket}>
        <Card elevation={1}>
          <CardHeader title={'Editar ticket'} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                value={editTicketEstablishmentName}
                onChange={(e) => setEditTicketEstablishmentName(e.target.value)}
                type={'text'}
                placeholder={'Nombre del establecimiento'}
                fullWidth
                label={'Nombre del establecimiento'}
                hiddenLabel
                variant={'outlined'}
                disabled={loading}
              />
              <DatePicker
                label="Fecha del ticket"
                value={editTicketDate}
                onChange={setEditTicketDate}
                disableFuture
              />
              <TextField
                value={editTicketTotal}
                onChange={(e) => setEditTicketTotal(e.target.value)}
                type={'number'}
                placeholder={'Total'}
                fullWidth
                label={'Total'}
                hiddenLabel
                variant={'outlined'}
                disabled={loading}
              />
            </Stack>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleCloseEditWindow}
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
  </Container>;
}

/* Sub-componente para filas de totales alineadas tipo ticket */
function Row({ label, value, strong, primaryStyles, secondaryStyles }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "baseline",
      }}
    >
      {
        typeof label === 'string' && <Typography
          variant="body2"
          sx={{
            ...primaryStyles,
          }}
          color={strong ? "inherit" : "text.secondary"}
        >
          {label}
        </Typography>
      }
      {
        typeof label !== 'string' && label
      }
      <Typography
        variant="body2"
        sx={{
          textAlign: "right",
          fontWeight: strong ? 800 : 600,
          ...secondaryStyles,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}