import v1Manager from '@/shared/v1Manager';
import React from 'react';
import nookies from 'nookies';
import NextLink from 'next/link';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import AppTitle from "@/components/App/AppTitle";

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso || '-';
  }
};

const fmtMoney = (value, currency = 'MXN') => {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value || 0);
  } catch {
    return `${value} ${currency}`;
  }
};

function SpaceJoin(data) {
  const ev = data.initialEvent;
  const owner = ev?.members?.find((member) => member.role === 'owner');

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background: 'linear-gradient(135deg, #FFD6E5 0%, #D6E0FF 100%)', // gradient SplitMate pastel
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ width: '100%', maxWidth: 640 }}>
        {/* Título de la app */}
        <Stack direction={'row'}>
          <AppTitle />
        </Stack>

        {/* Card principal */}
        <Card
          elevation={4}
          sx={{
            width: '100%',
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
          }}
        >
          <CardContent>
            <Stack spacing={2.5} alignItems="center" textAlign="center">
              {/* Nombre del espacio */}
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(90deg, #4C6FFF, #A78BFA)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                {ev.name}
              </Typography>

              {/* Chips */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                justifyContent="center"
              >
                <Chip
                  label={`Código: ${ev.event_code}`}
                  variant="soft"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Fecha: ${fmtDate(ev.event_date)}`}
                  variant="soft"
                  color="secondary"
                />
                <Chip
                  label={`Moneda: ${ev.currency}`}
                  variant="soft"
                  sx={{ bgcolor: 'rgba(255,229,0,0.15)', color: '#12172A' }}
                />
              </Stack>

              {/* Owner */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: '#4C6FFF',
                    color: 'white',
                    fontWeight: 700,
                  }}
                  src={owner?.profile_image_url}
                >
                  {owner?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Stack>
                  <Typography variant="caption" color="text.secondary">
                    Owner
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {
                      owner.first_name
                        ? `${owner.first_name} ${owner.last_name}`
                        : `${owner?.username}`
                    }
                  </Typography>
                </Stack>
              </Stack>

              <Divider flexItem sx={{ my: 1.5 }} />

              {/* Descripción */}
              <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
                {ev.description}
              </Typography>

              {/* Métricas */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  />
                }
                sx={{ mt: 1 }}
              >
                <Typography variant="body2">
                  Miembros: <b>{ev.members_count}</b>
                </Typography>
                <Typography variant="body2">
                  Tickets: <b>{ev.tickets_count}</b>
                </Typography>
                <Typography variant="body2">
                  Total: <b>{fmtMoney(ev.total_amount, ev.currency)}</b>
                </Typography>
              </Stack>

              {/* Botón Entrar */}
              <Button
                component={NextLink}
                href={`/login?next=${encodeURIComponent(`/space/${ev.id}/join`)}`}
                variant="contained"
                size="large"
                sx={{
                  mt: 1,
                  borderRadius: 3,
                  px: 4,
                  background: 'linear-gradient(135deg, #4C6FFF, #FF4D8D)',
                  ':hover': { filter: 'brightness(1.05)' },
                }}
              >
                Entrar al espacio
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Nota inferior */}
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 420 }}
        >
          Estás viendo una vista previa pública del espacio. Inicia sesión o crea una cuenta para participar.
        </Typography>
      </Stack>
    </Box>
  );
}

export const getServerSideProps = async (ctx) => {
  let event;
  try {
    const { id } = ctx.params;
    const eventResult = await v1Manager.get(`/v1/events/${id}`);

    if (!eventResult?.data?.success) {
      return { notFound: true };
    }

    event = eventResult.data.data;
    let joinData = {};

    const cookies = nookies.get({ req: ctx.req });
    const at = cookies.at;

    if (at) {
      try {
        const joinResult = await v1Manager.post(
          '/v1/events/join',
          { event_code: event.event_code },
          {
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${at}`,
            },
          }
        );

        if (joinResult.data.success) {
          return {
            redirect: {
              destination: `/space/${event.id}?mode=joined`,
              permanent: false,
            },
          };
        }
      } catch (error) {
        const data = error.toJSON();
        if (data.status === 400) {
          return {
            redirect: {
              destination: `/space/${event.id}`,
              permanent: false,
            },
          }
        }
      }
    }

    return { props: { initialEvent: event, joinData } };
  } catch (error) {
    return { notFound: true };
  }
};

export default SpaceJoin;