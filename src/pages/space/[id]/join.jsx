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
        background:
          'linear-gradient(135deg, #FFF9C4 0%, #F5F5F5 100%)', // fondo suave
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ width: '100%', maxWidth: 640 }}>
        {/* Título de la app */}
        <Stack direction={'row'}>
          <AppTitle />
        </Stack>

        <Card elevation={3} sx={{ width: '100%' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center" textAlign="center">
              {/* Nombre del espacio */}
              <Typography variant="h5" fontWeight={700}>
                {ev.name}
              </Typography>

              {/* Chips de metadata */}
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                <Chip label={`Código: ${ev.event_code}`} color="default" variant="outlined" />
                <Chip label={`Fecha: ${fmtDate(ev.event_date)}`} variant="outlined" />
                <Chip label={`Moneda: ${ev.currency}`} variant="outlined" />
                {/*<Chip*/}
                {/*  label={ev.status === 'active' ? 'Activo' : ev.status}*/}
                {/*  color={ev.status === 'active' ? 'success' : 'default'}*/}
                {/*  variant="filled"*/}
                {/*  size="small"*/}
                {/*/>*/}
              </Stack>

              {/* Owner */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  src={owner?.profile_image_url}
                >
                  {owner?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Stack>
                  <Typography variant="body2" color="text.secondary">
                    Owner
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {owner?.first_name} {owner?.last_name}
                  </Typography>
                </Stack>
              </Stack>

              <Divider sx={{ width: '100%', my: 1 }} />

              {/* Descripción */}
              <Typography variant="body1" color="text.secondary">
                {ev.description}
              </Typography>

              {/* Métricas */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />}
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
                sx={{ mt: 1 }}
              >
                Entrar al espacio
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.disabled" textAlign="center">
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
      return {
        notFound: true
      };
    }

    event = eventResult.data.data;
    let joinData = {};

    const cookies = nookies.get({ req: ctx.req });
    const at = cookies.at;

    if (at) {
      const joinResult = await v1Manager.post(
        '/v1/events/join', 
        {
          event_code: event.event_code,
        },
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${at}`,
            }
        }
      );

      if (joinResult.data.success) {
        return {
          redirect: {
            destination: `/space/${event.id}?mode=joined`,
            permanent: false
          }
        }
      }
    }

    return {
      props: {
        initialEvent: event,
        joinData,
      }
    };
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data;
      if (!errorData.success) {
        return {
          redirect: {
            destination: `/space/${event.id}`,
            permanent: false
          }
        };
      }
    }
    return {
      notFound: true
    };
  }
};

export default SpaceJoin;