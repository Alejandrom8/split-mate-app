import {Card, CardContent, Chip, Stack, Typography} from "@mui/material";
import * as React from "react";
import {fmtMoney} from "@/shared/utils";
import {TICKET_STATUS_MAP} from "@/shared/constants";

export default function TicketRow({ ticket, onSelect }) {
  return (
    <Card
      variant="outlined"
      onClick={() => onSelect?.(ticket)}
      sx={{
        cursor: "pointer",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={700}>{ticket?.establishment_name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(ticket?.ticket_date).toLocaleString("es-MX")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                color={TICKET_STATUS_MAP[ticket?.validation_status]?.color || "default"}
                label={TICKET_STATUS_MAP[ticket.validation_status]?.label || ticket.validation_status}
              />
              <Chip size="small" variant="outlined" label={`${ticket.items_count} ítems`} />
              <Chip size="small" variant="outlined" label={`${ticket.participants_count} amigos`} />
            </Stack>
          </Stack>
          <Typography variant="h6" fontWeight={800}>{fmtMoney(ticket.total_amount)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}