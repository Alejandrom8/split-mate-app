import * as React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { fullName } from "@/shared/utils";

// ---- Helpers ----
const toNumber = (v) => (v == null ? 0 : typeof v === "string" ? Number(v) : v);
const fmtCurrency = (n, currency = "MXN") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

const amountColor = (theme, n) => {
  if (n === 0) return theme.palette.text.secondary;
  if (n < 250) return theme.palette.success.main;
  if (n < 500) return theme.palette.warning.main;
  return theme.palette.error.main;
};

// ---- Component ----
export default function TicketBalanceCard({
  data,
  currency = "MXN",
}) {
  const totalAmount = toNumber(data.total_amount);
  const participantsTotal = data.participants.reduce(
    (acc, p) => acc + toNumber(p.debt_total_amount),
    0
  );
  const sharedPool = data.participants.reduce(
    (acc, p) => acc + toNumber(p.debt_shared_amount),
    0
  );
  const individualPool = data.participants.reduce(
    (acc, p) => acc + toNumber(p.debt_individual_amount),
    0
  );

  const progress = Math.min(
    100,
    Math.round((participantsTotal / totalAmount) * 100)
  );

  return <Box
    sx={{
      backgroundAttachment: 'fixed',
      borderRadius: 1,
    }}
  >
    <Card
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: 0,
      }}
    >
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ px: 0.25, pb: 0.25 }}
            >
              <PeopleIcon fontSize="small" />
              <Typography variant="body2" fontWeight={800}>
                Participants ({data.participants.length})
              </Typography>
            </Stack>

            <List disablePadding dense>
              {data.participants.map((p, idx) => {
                const total = toNumber(p.debt_total_amount);
                const individual = toNumber(p.debt_individual_amount);
                const shared = toNumber(p.debt_shared_amount);

                return (
                  <Box key={p.user.id}>
                    <ListItem
                      alignItems="center"
                      disableGutters
                      sx={{ py: 0.25, px: 0.5 }}
                      secondaryAction={
                        <Chip
                          size="small"
                          label={fmtCurrency(total, currency)}
                          sx={(theme) => ({
                            height: 20,
                            px: 0.5,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            color: amountColor(theme, total),
                          })}
                        />
                      }
                    >
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar
                          src={p.user.profile_image_url || undefined}
                          alt={fullName(p.user)}
                          sx={{ width: 28, height: 28, fontSize: 12 }}
                        >
                          {fullName(p.user).slice(0, 1).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {fullName(p.user)}
                          </Typography>
                        }
                        secondary={
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Ind: ${fmtCurrency(
                                individual,
                                currency
                              )}`}
                              sx={{ height: 18, fontSize: 10 }}
                            />
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Shd: ${fmtCurrency(shared, currency)}`}
                              sx={{ height: 18, fontSize: 10 }}
                            />
                          </Stack>
                        }
                        primaryTypographyProps={{ lineHeight: 1.15 }}
                        secondaryTypographyProps={{
                          component: "div",
                          sx: { mt: 0.25 },
                        }}
                      />
                    </ListItem>

                    {idx < data.participants.length - 1 && (
                      <Divider component="li" sx={{ mx: 0.5 }} />
                    )}
                  </Box>
                );
              })}
            </List>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Shared pool
                </Typography>
                <Typography fontWeight={700}>
                  {fmtCurrency(sharedPool, currency)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Individual items
                </Typography>
                <Typography fontWeight={700}>
                  {fmtCurrency(individualPool, currency)}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  Total ticket
                </Typography>
                <Typography variant="subtitle1" fontWeight={800}>
                  {fmtCurrency(totalAmount, currency)}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* {user.assignments && user.assignments.length > 0 && (
          <Accordion
            disableGutters
            sx={{ borderRadius: 3, overflow: "hidden" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" fontWeight={600}>
                Itemized assignments · {user.assignments.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List disablePadding>
                {user.assignments.map((a) => (
                  <ListItem key={a.id} sx={{ py: 0.75 }}>
                    <ListItemText
                      primary={
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Typography>{a.item_name}</Typography>
                          <Typography fontWeight={700}>
                            {fmtCurrency(
                              toNumber(a.assignment_amount),
                              currency
                            )}
                          </Typography>
                        </Stack>
                      }
                      secondary={`Qty ${a.total_quantity} · Unit ${fmtCurrency(
                        toNumber(a.item_unit_price),
                        currency
                      )}`}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )} */}

        {/* Shared Items */}
        <Box>
          {/* <Accordion
            disableGutters
            sx={{ borderRadius: 3, overflow: "hidden" }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={800}>Shared items</Typography>
                <Chip size="small" label={data.shared_items.length} />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <List disablePadding>
                {data.shared_items.map((it, i) => (
                  <React.Fragment key={`${it.name}-${i}`}>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            gap={1}
                          >
                            <Stack>
                              <Typography fontWeight={700}>
                                {it.name}
                              </Typography>
                              {it.description && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {it.description}
                                </Typography>
                              )}
                            </Stack>
                            <Stack textAlign="right">
                              <Typography fontWeight={800}>
                                {fmtCurrency(
                                  toNumber(
                                    it.total_shared_amount || it.total_price
                                  ),
                                  currency
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {`${it.total_quantity_shared} × ${fmtCurrency(
                                  toNumber(it.unit_price),
                                  currency
                                )}`}
                              </Typography>
                            </Stack>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {i < data.shared_items.length - 1 && (
                      <Divider component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion> */}
        </Box>
      </CardContent>
    </Card>
  </Box>;
}

// ---- Example usage ----
// <TicketBalanceCard data={ticketJson} currency="MXN" />
