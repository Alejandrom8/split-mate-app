"use client";
import * as React from "react";
import {
  Typography,
  Avatar,
  Box,
  Container,
  Grid,
  Stack,
  Button,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import Paid from "@mui/icons-material/Paid";
import ReceiptLong from "@mui/icons-material/ReceiptLong";
import People from "@mui/icons-material/People";
import Info from "@mui/icons-material/Info";
import CheckCircle from "@mui/icons-material/CheckCircle";
import {withAuth} from "@/shared/withAuth";
import v1Manager from "@/shared/v1Manager";
import ShareDialog from "@/components/Spaces/ShareDialog";
import {useState} from "react";
import NextLink from 'next/link';
import Link from "@mui/material/Link";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {useRouter} from "next/router";
import CreateSpaceSpeedDial from "@/components/App/CreateSpeedDial";
import Head from "next/head";
import HomeIcon from '@mui/icons-material/Home';
import TicketCard from "@/components/Tickets/TicketCard";
import {fmtMoney} from "@/shared/utils";
import EmptySection from "@/components/App/EmptySection";
import {useSpeedDial} from "@/context/SpeedDialContext";
import {useSnackbar} from "notistack";
import clientManager from "@/shared/clientManager";
import LoadingSection from "@/components/App/LoadingSection";
import AvatarGroupTight from "@/components/App/AvatarGroupTight";

// ---------- Helpers ----------
// ---------- Mock data ----------
const mockMembers = [
  { id: "u1", name: "Alex", avatar: "https://i.pravatar.cc/64?img=68" },
  { id: "u2", name: "Maggy", avatar: "https://i.pravatar.cc/64?img=5" },
  { id: "u3", name: "Roni", avatar: "https://i.pravatar.cc/64?img=12" },
  { id: "u4", name: "Lis", avatar: "https://i.pravatar.cc/64?img=23" },
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

// ---------- Página Detalle de espacio ----------
function SpaceDetailPage({ authHeader, initialData, initialEventTickets, initialEventBalance }) {
  const [tab, setTab] = React.useState(0);
  const [tickets, setTickets] = React.useState(initialEventTickets);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();
  const { onCloseUploadTicket } = useSpeedDial();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const handleTicketUploaded = (newTicket) => {
    onCloseUploadTicket();
    router.push(`/space/${initialData?.id}/ticket/${newTicket.ticket_id}`);
  };

  const handleDeleteCompleted = async () => {
    setLoading(true);
    try {
      const result = await clientManager.get(`/space/${initialData?.id}/tickets`);
      setTickets(result?.data?.tickets);
    } catch (error) {
      enqueueSnackbar('Error al cargar tickets', { variant: 'error' })
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`Split Mate | ${initialData?.name}`}</title>
        <meta name="description" content="Split Mate - separa gastos con tus amigos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph básico */}
        <meta property="og:title" content={`Split Mate | ${initialData?.name}`} />
        <meta property="og:description" content="Split Mate - separa gastos con tus amigos" />
        <meta property="og:image" content="https://split-mate-app.vercel.app/favicon.ico" />
        <meta property="og:url" content="https://split-mate-app.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>

      <CreateSpaceSpeedDial
        authHeader={authHeader}
        spaceId={initialData?.id}
        onSpaceCreated={() => router.push('/home')}
        onTicketUploaded={handleTicketUploaded}
      />

        <Box sx={{
          py: 3,
          px: 1,
          pb: 0,
          backgroundColor: '#fff',
        }}>
          <Container>
            {/* Navegación */}
            <Breadcrumbs sx={{ pb: 3 }} separator={<NavigateNextIcon fontSize="small" />}>
              <Link color="primary" href="/" component={NextLink} sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon fontSize={'small'} sx={{ mr: 1 }}/>
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
                  <AvatarGroupTight members={initialData?.members} />
                  <Typography variant="body2" color="text.secondary">
                    {initialData?.members_count} miembros · {initialData?.tickets_count} tickets
                  </Typography>
                </Stack>
                <Typography variant={'body1'} sx={{ color: '#777', fontWeight: '500', fontStyle: 'italic' }}>
                  {initialData?.description}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="soft" startIcon={<PersonAddAlt1 />} onClick={() => setShareOpen(true)}>Invitar</Button>
                <ShareDialog
                  open={shareOpen}
                  onClose={() => setShareOpen(false)}
                  shareUrl={
                    typeof window !== "undefined"
                      ? `${window.location.href}/join`
                      : "/"
                  }
                />
                <Button variant="gradient" startIcon={<Paid />}>Saldar cuentas</Button>
              </Stack>
            </Stack>

            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              scrollButtons
              allowScrollButtonsMobile
              variant={isSm ? 'fullWidth' : 'standard'}
              sx={{ height: '60px' }}
            >
              <Tab icon={<ReceiptLong />} iconPosition="start" label="Tickets" />
              <Tab icon={<Info />} iconPosition="start" label="Balance" />
              <Tab icon={<People />} iconPosition="start" label="Miembros" />
              {/*<Tab icon={<TimelineIcon />} iconPosition="start" label="Actividad" />*/}
            </Tabs>
          </Container>
        </Box>

        <Container sx={{ py: 3, mt: 1, minHeight: '50vh' }}>
        {/* Tab 1 - Tickets */}
        {tab === 0 && (
          <>
            {
              loading && <LoadingSection />
            }
            {
              !loading && tickets.length === 0 && <EmptySection />
            }
            {
              !loading && tickets.length > 0 && (
                <Grid container spacing={2} sx={{ pb: 10 }}>
                  {tickets?.length > 0 && tickets.map((t) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
                      <TicketCard
                        ticket={t}
                        onSelect={(tk) => router.push(`/space/${initialData?.id}/ticket/${tk.id}`)}
                        onDeleteCompleted={handleDeleteCompleted}
                      />
                    </Grid>
                  ))}
                </Grid>
              )
            }
          </>
        )}

        {/* Tab 2 - Balance */}
          {tab === 1 && (
                <Grid container spacing={2}>
              {/**
                  <Grid item size={{ xs:12, sm: 6, md: 4 }}>
                    <SummaryStat icon={<Paid />} label="Total gastado" value={fmtMoney(initialData?.total_amount)} />
                  </Grid>
                  <Grid item size={{ xs:12, sm: 6, md: 4 }}>
                    <SummaryStat icon={<ReceiptLong />} label="Tickets" value={initialData?.tickets_count} hint="2 pendientes de confirmar" color="warning.main" />
                  </Grid>
                  <Grid item size={{ xs:12, sm: 6, md: 4 }}>
                    <SummaryStat icon={<CheckCircle />} label="Asignación" value="78%" hint="Ítems asignados" color="success.main" />
                  </Grid>
              */}

              {/* Renderizar deudas */}
                  {initialEventBalance.map((debt, index) => (
                    <Grid size={{ xs: 12 }} key={index}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          p: 1,
                        }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            {/* Avatar + User */}
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                src={debt.member.profile_image_url}
                                alt={debt.member.username}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  fontWeight: 700,
                                }}
                              >
                                {debt.member.username?.[0]?.toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={700}>
                                  {debt.member.username}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  Balance general
                                </Typography>
                              </Box>
                            </Stack>

                            {/* Balance principal */}
                            <Box textAlign="right">
                              <Typography
                                variant="h6"
                                fontWeight={800}
                                sx={{
                                  color:
                                    parseFloat(debt.balance) >= 0
                                      ? "success.main"
                                      : "error.main",
                                }}
                              >
                                {fmtMoney(debt.balance)}
                              </Typography>
                              <Stack direction="row" spacing={1} mt={0.5}>
                                <Chip
                                  size="small"
                                  label={`+ ${fmtMoney(debt.owed_to_me)}`}
                                  sx={{
                                    bgcolor: "success.light",
                                    color: "success.dark",
                                    fontWeight: 600,
                                  }}
                                />
                                <Chip
                                  size="small"
                                  label={`- ${fmtMoney(debt.i_owe)}`}
                                  sx={{
                                    bgcolor: "error.light",
                                    color: "error.dark",
                                    fontWeight: 600,
                                  }}
                                />
                              </Stack>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          )}


        {/* Tab 3 - Miembros */}
        {tab === 2 && (
          <Card variant="outlined">
            <CardHeader title="Miembros" action={<Button variant="outlined" startIcon={<PersonAddAlt1 />}>Invitar</Button>} />
            <CardContent>
              <Grid container spacing={2}>
                {initialData?.members?.map((m) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
                    <Card
                      variant="outlined"
                      onClick={() => router.push(`/profile/${m.id}`)}
                      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar src={m.profile_picture_url} alt={m.username} />
                            <Box>
                              <Typography fontWeight={700}>{m.username}</Typography>
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

        {/* Tab 4 - Actividad */}
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

export const getServerSideProps = withAuth(async ({ authHeader, ...ctx }) => {
  try {
    const { id } = ctx.params;
    if (!id) {
      return { notFound: true };
    }

    const initialEventData = await v1Manager.get(`/v1/events/${id}`, {}, authHeader);
    const initialEventTickets = await v1Manager.get(`/v1/tickets/events/${id}/tickets`, {}, authHeader);
    const initialEventBalance = await v1Manager.get(`/v1/balance/${id}`, {}, authHeader);

    return {
      props: {
        authHeader,
        initialData: initialEventData.data?.data,
        initialEventTickets: initialEventTickets.data?.data?.tickets,
        initialEventBalance: initialEventBalance.data?.data?.debts,
      }
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
});

export default SpaceDetailPage;