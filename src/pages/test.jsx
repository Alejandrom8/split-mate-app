import * as React from "react";
import {
  Avatar, Box, Card, CardContent, Chip, Divider, Grid, Stack, Typography, List, ListItem, ListItemAvatar, ListItemText
} from "@mui/material";

// ---------- helpers ----------
const parseMoney = (s) => (s == null ? 0 : Number.parseFloat(String(s)));
const fmt = (n, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(n);

const getInitials = (first, last, username) => {
  const a = (first || "").trim();
  const b = (last || "").trim();
  if (a || b) return `${a?.[0] ?? ""}${b?.[0] ?? ""}`.toUpperCase();
  return (username?.[0] ?? "?").toUpperCase();
};

// ---------- resumen card ----------
function StatCard({ label, value, color = "default" }) {
  const tone =
    color === "success" ? "success.main" :
      color === "error" ? "error.main" :
        "text.primary";
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: tone }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

// ---------- fila de deuda ----------
function DebtRow({ debt, currency = "MXN" }) {
  const owedToMe = parseMoney(debt.owed_to_me);
  const iOwe     = parseMoney(debt.i_owe);
  const balance  = parseMoney(debt.balance); // + te deben / - tú debes

  const member = debt.member;
  const name =
    [member.first_name, member.last_name].filter(Boolean).join(" ").trim() ||
    member.username ||
    member.email;

  const badge =
    balance > 0 ? <Chip size="small" label="Te debe" color="success" variant="outlined" /> :
      balance < 0 ? <Chip size="small" label="Debes"  color="error"   variant="outlined" /> :
        <Chip size="small" label="En paz" color="default" variant="outlined" />;

  return (
    <ListItem
      sx={{
        px: 0,
        "&:not(:last-of-type)": { borderBottom: (t) => `1px solid ${t.palette.divider}` }
      }}
      disableGutters
    >
      <ListItemAvatar>
        {member.profile_image_url ? (
          <Avatar src={member.profile_image_url} alt={name} />
        ) : (
          <Avatar>{getInitials(member.first_name, member.last_name, member.username)}</Avatar>
        )}
      </ListItemAvatar>

      <ListItemText
        primary={<Typography fontWeight={600}>{name}</Typography>}
        secondary={
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            {badge}
          </Stack>
        }
      />

      {/* columnas de montos */}
      <Stack
        direction="row"
        spacing={3}
        sx={{ minWidth: { xs: 200, sm: 320 }, justifyContent: "flex-end" }}
      >
        <Box textAlign="right">
          <Typography variant="caption" color="text.secondary">Te debe</Typography>
          <Typography fontWeight={700}>{fmt(owedToMe, currency)}</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="caption" color="text.secondary">Le debes</Typography>
          <Typography fontWeight={700}>{fmt(iOwe, currency)}</Typography>
        </Box>
        <Box textAlign="right" sx={{ minWidth: 96 }}>
          <Typography variant="caption" color="text.secondary">Balance</Typography>
          <Typography
            fontWeight={800}
            sx={{ color: balance > 0 ? "success.main" : balance < 0 ? "error.main" : "text.primary" }}
          >
            {fmt(balance, currency)}
          </Typography>
        </Box>
      </Stack>
    </ListItem>
  );
}

// ---------- vista principal ----------
function SplitBalanceView({ payload, currency = "MXN" }) {
  const data = payload?.data;
  const me = data?.member;

  const totals = React.useMemo(() => {
    const sum = (arr, key) => arr.reduce((acc, d) => acc + parseMoney(d[key]), 0);
    const owedToMe = sum(data?.debts ?? [], "owed_to_me");
    const iOwe     = sum(data?.debts ?? [], "i_owe");
    const net      = owedToMe - iOwe; // >0 te deben; <0 tú debes
    return { owedToMe, iOwe, net };
  }, [data]);

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        {me?.profile_image_url ? (
          <Avatar src={me.profile_image_url} alt={me.first_name || me.username} />
        ) : (
          <Avatar>
            {getInitials(me?.first_name, me?.last_name, me?.username)}
          </Avatar>
        )}
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Balance del evento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {me?.first_name || me?.username} · {data?.event_id?.slice(0, 8)}
          </Typography>
        </Box>
      </Stack>

      {/* Resumen */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Te deben" value={fmt(totals.owedToMe, currency)} color="success" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Debes" value={fmt(totals.iOwe, currency)} color="error" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            label="Balance neto"
            value={fmt(totals.net, currency)}
            color={totals.net > 0 ? "success" : totals.net < 0 ? "error" : "default"}
          />
        </Grid>
      </Grid>

      {/* Lista por miembro */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Personas con balance pendiente
          </Typography>
          <Divider />
          <List sx={{ mt: 0, pt: 0 }}>
            {(data?.debts ?? []).map((debt) => (
              <DebtRow key={debt.member.id} debt={debt} currency={currency} />
            ))}
            {(!data?.debts || data.debts.length === 0) && (
              <Box py={4} textAlign="center">
                <Typography color="text.secondary">No hay balances pendientes.</Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      currency: 'MXN',
      payload: {
        "success": true,
        "message": "Operation successful",
        "data": {
          "event_id": "aa9e3dd6-3aac-4920-becd-903b3804ef45",
          "member": {
            "id": "6faa8055-0377-4062-94df-84160ffef717",
            "user_id": "4ba3d8f2-1551-4975-beaa-a3ff219d5c07",
            "username": "alex_4",
            "email": "alex_4@gmail.com",
            "first_name": "Alejandro",
            "last_name": "Gómez",
            "profile_image_url": "https://res.cloudinary.com/dwcemtz63/image/upload/c_fill,f_auto,g_auto,h_150,q_auto:good,w_150/v1/split_mate/profiles/20250914_071154_IMG_0018_9bd8fe9b",
            "role": "owner",
            "status": "active"
          },
          "debts": [
            {
              "owed_to_me": "150.00",
              "i_owe": "100.00",
              "balance": "50.00",
              "member": {
                "id": "0fc69726-e24b-483e-929f-ee4289c4bebf",
                "user_id": "ea89112b-d98b-4cdc-a9eb-de84357d0a2a",
                "username": "alex_5",
                "email": "alex_5@gmail.com",
                "first_name": "",
                "last_name": "",
                "profile_image_url": null,
                "role": "member",
                "status": "active"
              }
            },
            {
              "owed_to_me": "150.00",
              "i_owe": "100.00",
              "balance": "50.00",
              "member": {
                "id": "18dc0c42-41ed-4582-850b-f0339126b45e",
                "user_id": "f95a5049-2851-47ad-986a-f5bbde3dc3dd",
                "username": "alex_3",
                "email": "alex_3@gmail.com",
                "first_name": "",
                "last_name": "",
                "profile_image_url": null,
                "role": "member",
                "status": "active"
              }
            },
            {
              "owed_to_me": "150.00",
              "i_owe": "100.00",
              "balance": "50.00",
              "member": {
                "id": "91fc9d63-17c5-421b-8247-4af4505430f5",
                "user_id": "980b8829-d0c2-4562-ab9b-ce766d3f7c80",
                "username": "alex_2",
                "email": "alex_2@example.com",
                "first_name": "",
                "last_name": "",
                "profile_image_url": null,
                "role": "member",
                "status": "active"
              }
            },
            {
              "owed_to_me": "150.00",
              "i_owe": "100.00",
              "balance": "50.00",
              "member": {
                "id": "8543a666-6778-4541-9ce6-18107aeb6982",
                "user_id": "1f0f5e3f-8520-4aee-bd73-780bf3736f73",
                "username": "alex",
                "email": "alex@example.com",
                "first_name": "",
                "last_name": "",
                "profile_image_url": null,
                "role": "member",
                "status": "active"
              }
            }
          ]
        },
        "trace_id": "079c7f05-1e6c-4377-8d1d-bc33cc88ff67"
      }
    }
  }
};

export default SplitBalanceView;