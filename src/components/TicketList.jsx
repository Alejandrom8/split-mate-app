import * as React from "react";
import { Grid, Container } from "@mui/material";
import TicketCard from "./TicketCard"; // importa tu componente
import { useRouter } from "next/router";

export default function TicketsList() {

  const router = useRouter();
  // Datos de ejemplo (mock)
  const mockTickets = [
    {
      id: 1,
      picture: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800",
      place: "Starbucks Reforma",
      uploadedAt: "2025-08-20T14:23:00Z",
      total: 185.5,
      totalWithTip: 200,
      status: "ready",
      itemsCount: 4,
      participantsCount: 2,
    },
    {
      id: 2,
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      total: 980,
      totalWithTip: 1100,
      status: "processing",
      itemsCount: 12,
      participantsCount: 5,
    },
    {
      id: 3,
      picture: "",
      place: "Uber Eats",
      uploadedAt: "2025-08-25T21:10:00Z",
      total: 320,
      status: "pending",
      itemsCount: 6,
      participantsCount: 3,
    },
  ];

  const handleClick = (ticket) => {
    router.push('/ticket/1');
  };

  return (
    <Grid container spacing={3}>
    {mockTickets.map((ticket) => (
        <Grid item xs={12} sm={6} md={4} key={ticket.id}>
        <TicketCard
            {...ticket}
            onClick={() => handleClick(ticket)}
        />
        </Grid>
    ))}
    </Grid>
  );
}