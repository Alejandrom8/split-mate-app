// components/TicketsList.jsx
import * as React from "react";
import { Grid, Box, Button } from "@mui/material";
import TicketCard from "./TicketCard";

export default function TicketsList({
  tickets = [],
  selectedId,
  onSelectTicket,
  onEditTicket,
  onShareTicket,
  onSplitTicket,
  onLoadMore,
}) {
  return (
    <Box width='100%'>
      <Grid container spacing={3} display='flex' flexWrap={'wrap'}>
        {tickets.map((t) => (
          <Grid item xs={6} key={t.id}>
              <TicketCard
                picture={t.picture}
                place={t.place}
                uploadedAt={t.uploadedAt}
                total={t.total}
                totalWithTip={t.totalWithTip}
                currency={t.currency}
                status={t.status}
                itemsCount={t.itemsCount}
                participantsCount={t.participantsCount}
                onClick={() => onSelectTicket?.(t)}
              />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}