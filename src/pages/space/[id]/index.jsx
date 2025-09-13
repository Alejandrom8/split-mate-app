"use client";
import * as React from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider,
  Box, Container, Grid, Stack, Button, Chip, Card, CardContent, CardHeader,
  Tabs, Tab, Tooltip, LinearProgress, List, ListItem, ListItemText, Badge, Breadcrumbs
} from "@mui/material";
import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import Paid from "@mui/icons-material/Paid";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import People from "@mui/icons-material/People";
import TimelineIcon from "@mui/icons-material/Timeline";
import Info from "@mui/icons-material/Info";
import Add from "@mui/icons-material/Add";
import CheckCircle from "@mui/icons-material/CheckCircle";
import {withAuth} from "@/shared/withAuth";
import nookies from "nookies";
import v1Manager from "@/shared/v1Manager";
import ShareDialog from "@/components/Spaces/ShareDialog";
import {useState} from "react";
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TicketDropzone from "@/components/Tickets/TicketDropzone";
import {useRouter} from "next/router";
import CreateSpaceSpeedDial from "@/components/Spaces/CreateSpaceDial";

// ---------- Helpers ----------
const fmtMoney = (n, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(n);

// Sugerencia simple de pagos: compensa positivos con negativos (greedy)
function suggestPayments(balances) {
  const debtors = [];
  const creditors = [];
  balances.forEach((b) => {
    if (b.net < -0.01) debtors.push({ ...b, amount: -b.net });
    if (b.net > 0.01) creditors.push({ ...b, amount: b.net });
  });
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  const tx = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    tx.push({ from: debtors[i].name, to: creditors[j].name, amount: pay });
    debtors[i].amount -= pay; creditors[j].amount -= pay;
    if (debtors[i].amount <= 0.01) i++;
    if (creditors[j].amount <= 0.01) j++;
  }
  return tx;
}

// ---------- Mock data ----------
const mockMembers = [
  { id: "u1", name: "Alex", avatar: "https://i.pravatar.cc/64?img=68" },
  { id: "u2", name: "Maggy", avatar: "https://i.pravatar.cc/64?img=5" },
  { id: "u3", name: "Roni", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: "u4", name: "Lis", avatar: "https://i.pravatar.cc/64?img=23" },
];

const mockTickets = [
  { id: "t1", place: "Taquería El Güero", total: 537.2, status: "ready", itemsCount: 6, participantsCount: 3, uploadedAt: "2025-08-28T20:14:00Z" },
  { id: "t2", place: "La Parrilla Mexicana", total: 1256.8, status: "processing", itemsCount: 12, participantsCount: 5, uploadedAt: "2025-08-22T19:40:00Z" },
  { id: "t3", place: "Uber Eats", total: 371.2, status: "pending", itemsCount: 6, participantsCount: 3, uploadedAt: "2025-08-25T21:10:00Z" },
];

const mockBalances = [
  { userId: "u1", name: "Alex", net: 250.0 },   // a favor
  { userId: "u2", name: "Maggy", net: -120.0 },// debe
  { userId: "u3", name: "Roni", net: -90.0 },   // debe
  { userId: "u4", name: "Lis", net: -40.0 },   // debe
];

// ---------- Subcomponentes simples ----------
function SummaryStat({ icon, label, value, hint, color = "primary.main" }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}20` }}>{icon}</Box>
          <Box>
            <Typography variant="overline" color="text.secondary">{label}</Typography>
            <Typography variant="h6" fontWeight={800}>{value}</Typography>
            {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TicketRow({ ticket, selected, onSelect }) {
  const statusMap = {
    ready: { label: "OCR listo", color: "success" },
    processing: { label: "Procesando", color: "warning" },
    pending: { label: "Pendiente", color: "warning" },
    error: { label: "Error", color: "error" },
  };
  return (
    <Card
      variant="outlined"
      onClick={() => onSelect?.(ticket)}
      sx={{
        cursor: "pointer",
        borderColor: selected ? "primary.main" : "divider",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700}>{ticket.place}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(ticket.uploadedAt).toLocaleString("es-MX")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip size="small" color={statusMap[ticket.status]?.color || "default"} label={statusMap[ticket.status]?.label || ticket.status} />
              <Chip size="small" variant="outlined" label={`${ticket.itemsCount} ítems`} />
              <Chip size="small" variant="outlined" label={`${ticket.participantsCount} amigos`} />
            </Stack>
          </Stack>
          <Typography variant="h6" fontWeight={800}>{fmtMoney(ticket.total)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function BalanceBoard({ balances }) {
  return (
    <Card variant="outlined">
      <CardHeader title="Balances por persona" />
      <CardContent>
        <List dense>
          {balances.map((b) => (
            <ListItem key={b.userId} secondaryAction={
              b.net >= 0
                ? <Chip color="success" label={`+ ${fmtMoney(b.net)}`} />
                : <Chip color="warning" label={`- ${fmtMoney(-b.net)}`} />
            }>
              <ListItemText primary={b.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

function PaymentsSuggestion({ balances }) {
  const tx = suggestPayments(balances);
  return (
    <Card variant="outlined">
      <CardHeader title="Sugerencia de pagos" subheader="Minimiza transferencias" />
      <CardContent>
        {tx.length === 0 ? (
          <Typography variant="body2" color="text.secondary">Todo está saldado 🎉</Typography>
        ) : (
          <List dense>
            {tx.map((t, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={<Typography><b>{t.from}</b> → <b>{t.to}</b></Typography>}
                  secondary={fmtMoney(t.amount)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}

// Avatares compactos
function AvatarGroupTight({ members }) {
  return (
    <Stack direction="row" spacing={-0.5}>
      {members.slice(0, 5).map((m) => (
        <Avatar key={m.id} src={m.avatar} alt={m.name} sx={{ width: 28, height: 28, border: "2px solid #fff" }} />
      ))}
      {members.length > 5 && (
        <Avatar sx={{ width: 28, height: 28, bgcolor: "grey.300", color: "text.primary", fontSize: 12 }}>
          +{members.length - 5}
        </Avatar>
      )}
    </Stack>
  );
}

// ---------- Página Detalle de espacio ----------
function SpaceDetailPage({ initialData }) {
  const [tab, setTab] = React.useState(0);
  const [tickets, setTickets] = React.useState(mockTickets);
  const [members, setMembers] = React.useState(mockMembers);
  const [balances, setBalances] = React.useState(mockBalances);
  const [selectedTicketId, setSelectedTicketId] = React.useState(tickets[0]?.id || null);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();

  const selectedTicket = React.useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  // Menú usuario (header)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <CreateSpaceSpeedDial
        onSpaceCreated={() => router.push('/')}
      />
      <Container sx={{ py: 3, minHeight: '100vh' }}>
        <Breadcrumbs sx={{ py: 2 }} separator={<NavigateNextIcon fontSize="small" />}>
          <Link color="primary" href="/">
            Inicio
          </Link>
          <Typography key="3" sx={{ color: 'text.primary' }}>
            {initialData?.name}
          </Typography>
        </Breadcrumbs>
        {/* Header del espacio */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5" fontWeight={800}>{initialData?.name}</Typography>
              <Chip size="small" color="primary" label={initialData?.currency} />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AvatarGroupTight members={members} />
              <Typography variant="body2" color="text.secondary">
                {initialData?.members_count} miembros · {initialData?.tickets_count} tickets
              </Typography>
            </Stack>
            <Typography>
              {initialData?.description}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<PersonAddAlt1 />} onClick={() => setShareOpen(true)}>Invitar</Button>
            <ShareDialog
              open={shareOpen}
              onClose={() => setShareOpen(false)}
              shareUrl={window ? `${window.location.href}/join` : ''}
            />
            <Button variant="contained" startIcon={<Paid />}>Settle up</Button>
          </Stack>
        </Stack>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab icon={<ReceiptLong />} iconPosition="start" label="Tickets" />
          <Tab icon={<Info />} iconPosition="start" label="Resumen" />
          <Tab icon={<People />} iconPosition="start" label="Miembros" />
          <Tab icon={<TimelineIcon />} iconPosition="start" label="Actividad" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={3} alignItems="flex-start">
            {/* Izquierda: listado */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {tickets.map((t) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
                    <TicketRow ticket={t} selected={t.id === selectedTicketId} onSelect={(tk) => setSelectedTicketId(tk.id)} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {/* Derecha: detalle(sticky). Reemplaza por tu <TicketDetail /> si ya lo tienes */}
            {/*<Grid item xs={12} md={4} sx={{ minWidth: 0 }}>*/}
            {/*  <Box sx={{ position: { md: "sticky" }, top: { md: 88 } }}>*/}
            {/*    {selectedTicket ? (*/}
            {/*      <Card variant="outlined">*/}
            {/*        <CardHeader title={selectedTicket.place} subheader={`Total: ${fmtMoney(selectedTicket.total)}`} />*/}
            {/*        <CardContent>*/}
            {/*          <LinearProgress variant="determinate" value={selectedTicket.status === "ready" ? 100 : selectedTicket.status === "processing" ? 60 : 20} sx={{ mb: 2 }} />*/}
            {/*          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>*/}
            {/*            <Chip size="small" label={`${selectedTicket.itemsCount} ítems`} />*/}
            {/*            <Chip size="small" label={`${selectedTicket.participantsCount} amigos`} />*/}
            {/*          </Stack>*/}
            {/*          <Typography variant="body2" color="text.secondary">*/}
            {/*            Subido: {new Date(selectedTicket.uploadedAt).toLocaleString("es-MX")}*/}
            {/*          </Typography>*/}
            {/*          <Box sx={{ mt: 2 }}>*/}
            {/*            <Button fullWidth variant="contained">Abrir ticket</Button>*/}
            {/*          </Box>*/}
            {/*        </CardContent>*/}
            {/*      </Card>*/}
            {/*    ) : (*/}
            {/*      <Card variant="outlined">*/}
            {/*        <CardContent>*/}
            {/*          <Typography variant="h6">Selecciona un ticket</Typography>*/}
            {/*          <Typography variant="body2" color="text.secondary">El detalle aparecerá aquí</Typography>*/}
            {/*        </CardContent>*/}
            {/*      </Card>*/}
            {/*    )}*/}
            {/*  </Box>*/}
            {/*</Grid>*/}
          </Grid>
        )}

        {tab === 1 && (
          <Grid container spacing={3} alignItems="flex-start">
            {/* KPIs */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <SummaryStat icon={<Paid />} label="Total gastado" value={fmtMoney(tickets.reduce((a, t) => a + t.total, 0))} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SummaryStat icon={<ReceiptLong />} label="Tickets" value={tickets.length} hint="2 pendientes de asignar" color="warning.main" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SummaryStat icon={<CheckCircle />} label="Asignación" value="78%" hint="Ítems asignados" color="success.main" />
                </Grid>
              </Grid>

              {/* Lista rápida de tickets */}
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardHeader title="Tickets recientes" action={<Button size="small" startIcon={<Add />}>Subir ticket</Button>} />
                <CardContent>
                  <Grid container spacing={2}>
                    {tickets.map((t) => (
                      <Grid item xs={12} key={t.id}>
                        <TicketRow ticket={t} selected={t.id === selectedTicketId} onSelect={(tk) => setSelectedTicketId(tk.id)} />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 2 && (
          <Card variant="outlined">
            <CardHeader title="Miembros" action={<Button variant="outlined" startIcon={<PersonAddAlt1 />}>Invitar</Button>} />
            <CardContent>
              <Grid container spacing={2}>
                {members.map((m) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
                    <Card
                      variant="outlined"
                      onClick={() => router.push(`/user/${m.id}`)}
                      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={m.avatar} alt={m.name} />
                            <Box>
                              <Typography fontWeight={700}>{m.name}</Typography>
                              <Typography variant="caption" color="text.secondary">Miembro</Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {tab === 3 && (
          <Card variant="outlined">
            <CardHeader title="Actividad" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Alex subió un ticket (Taquería El Güero)"
                    secondary="Hace 2 horas"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Maggie asignó 3 ítems"
                    secondary="Hace 1 hora"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps = withAuth(async (context) => {
  const cookies = nookies.get({ req: context.req });
  const at = cookies.at;

  if (!at) {
    return context.res.status(401).json({ error: 'No autorizado: falta cookie at' });
  }

  try {
    const { id } = context.params;
    const upstream = await v1Manager.get(`/v1/events/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${at}`,
      },
    });

    return {
      props: {
        initialData: upstream.data?.data,
      }
    };
  } catch (error) {
    console.log(error);
    return {};
  }
});

export default SpaceDetailPage;