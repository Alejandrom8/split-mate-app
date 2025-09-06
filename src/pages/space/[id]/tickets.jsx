import * as React from "react";
import Head from "next/head";
import { Box, Container, Grid, Typography, Card, CardContent } from "@mui/material";
import TicketsList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail"; // usa tu componente de detalle
import TicketCard from "@/components/TicketCard";
import StickyBox from "react-sticky-box";

export default function Home() {
  // Mock inicial (cámbialo por fetch/SSR cuando quieras)
  const [tickets, setTickets] = React.useState([
    {
      id: "t1",
      picture: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1600",
      place: "Taquería El Güero",
      uploadedAt: "2025-08-28T20:14:00Z",
      subtotal: 420,
      taxes: 67.2,
      tip: 50,
      total: 487.2,
      totalWithTip: 537.2,
      currency: "MXN",
      status: "ready",
      category: "Restaurante",
      paymentMethod: "Tarjeta",
      ocrConfidence: 0.92,
      itemsCount: 6,
      participantsCount: 3,
      participants: [
        { id: "u1", name: "Alex" },
        { id: "u2", name: "Maggie" },
        { id: "u3", name: "Roni" },
      ],
      items: [
        { name: "Tacos al pastor", qty: 6, total: 180 },
        { name: "Quesadillas", qty: 2, total: 80 },
        { name: "Refrescos", qty: 3, total: 90 },
        { name: "Agua", qty: 1, total: 25 },
        { name: "Propina sugerida", qty: 1, total: 50 },
        { name: "Postre", qty: 1, total: 60 },
      ],
      notes: "Separamos postre entre todos.",
    },
    {
      id: "t2",
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      subtotal: 980,
      taxes: 156.8,
      tip: 120,
      total: 1136.8,
      totalWithTip: 1256.8,
      currency: "MXN",
      status: "processing",
      category: "Restaurante",
      paymentMethod: "Efectivo",
      ocrConfidence: 0.78,
      itemsCount: 12,
      participantsCount: 5,
      participants: [{ id: "u1", name: "Alex" }, { id: "u4", name: "Lis" }],
      items: [],
    },
    {
      id: "t3",
      picture: "",
      place: "Uber Eats",
      uploadedAt: "2025-08-25T21:10:00Z",
      subtotal: 320,
      taxes: 51.2,
      tip: 0,
      total: 371.2,
      totalWithTip: 371.2,
      currency: "MXN",
      status: "pending",
      category: "Delivery",
      paymentMethod: "Tarjeta",
      ocrConfidence: 0.64,
      itemsCount: 6,
      participantsCount: 3,
      participants: [],
      items: [],
    },
    {
      id: "52",
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      subtotal: 980,
      taxes: 156.8,
      tip: 120,
      total: 1136.8,
      totalWithTip: 1256.8,
      currency: "MXN",
      status: "processing",
      category: "Restaurante",
      paymentMethod: "Efectivo",
      ocrConfidence: 0.78,
      itemsCount: 12,
      participantsCount: 5,
      participants: [{ id: "u1", name: "Alex" }, { id: "u4", name: "Lis" }],
      items: [],
    },
    {
      id: "32",
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      subtotal: 980,
      taxes: 156.8,
      tip: 120,
      total: 1136.8,
      totalWithTip: 1256.8,
      currency: "MXN",
      status: "processing",
      category: "Restaurante",
      paymentMethod: "Efectivo",
      ocrConfidence: 0.78,
      itemsCount: 12,
      participantsCount: 5,
      participants: [{ id: "u1", name: "Alex" }, { id: "u4", name: "Lis" }],
      items: [],
    },
    {
      id: "54",
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      subtotal: 980,
      taxes: 156.8,
      tip: 120,
      total: 1136.8,
      totalWithTip: 1256.8,
      currency: "MXN",
      status: "processing",
      category: "Restaurante",
      paymentMethod: "Efectivo",
      ocrConfidence: 0.78,
      itemsCount: 12,
      participantsCount: 5,
      participants: [{ id: "u1", name: "Alex" }, { id: "u4", name: "Lis" }],
      items: [],
    },
    {
      id: "423",
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      subtotal: 980,
      taxes: 156.8,
      tip: 120,
      total: 1136.8,
      totalWithTip: 1256.8,
      currency: "MXN",
      status: "processing",
      category: "Restaurante",
      paymentMethod: "Efectivo",
      ocrConfidence: 0.78,
      itemsCount: 12,
      participantsCount: 5,
      participants: [{ id: "u1", name: "Alex" }, { id: "u4", name: "Lis" }],
      items: [],
    },
    {
      id: "5345",
      picture: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1600",
      place: "La Parrilla Mexicana",
      uploadedAt: "2025-08-22T19:40:00Z",
      subtotal: 980,
      taxes: 156.8,
      tip: 120,
      total: 1136.8,
      totalWithTip: 1256.8,
      currency: "MXN",
      status: "processing",
      category: "Restaurante",
      paymentMethod: "Efectivo",
      ocrConfidence: 0.78,
      itemsCount: 12,
      participantsCount: 5,
      participants: [{ id: "u1", name: "Alex" }, { id: "u4", name: "Lis" }],
      items: [],
    },
  ]);

  // Ticket seleccionado
  const [selectedId, setSelectedId] = React.useState(tickets[0]?.id || null);
  const selectedTicket = React.useMemo(
    () => tickets.find(t => t.id === selectedId) || null,
    [tickets, selectedId]
  );

  // Callbacks que pasaremos a TicketsList (luego los podrás conectar a tu backend)
  const handleSelectTicket = (ticket) => setSelectedId(ticket?.id);
  const handleEditTicket = (ticket) => {
    // TODO: abre modal/route; por ahora demo
    alert(`Editar ticket: ${ticket.place}`);
  };
  const handleShareTicket = (ticket) => {
    // TODO: compartir (navigator.share / link)
    alert(`Compartir ticket: ${ticket.place}`);
  };
  const handleSplitTicket = (ticket) => {
    // TODO: redirigir al flujo de división
    alert(`Dividir gastos de: ${ticket.place}`);
  };

  return (
    <>
      <Head>
        <title>Split Mate</title>
        <meta name="description" content="Split Mate - separa gastos con tus amigos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <Grid container spacing={2}>
              {tickets.map((t) => (
                <Grid item key={t.id}>
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
                    onClick={() => handleSelectTicket?.(t)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item size={6}>
            <StickyBox offsetTop={10} offsetBottom={0}>
              {selectedTicket ? (
                <TicketDetail
                  ticket={selectedTicket}
                  onEdit={() => handleEditTicket(selectedTicket)}
                  onShare={() => handleShareTicket(selectedTicket)}
                  onSplit={() => handleSplitTicket(selectedTicket)}
                />
              ) : (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Selecciona un ticket</Typography>
                    <Typography variant="body2" color="text.secondary">
                      El detalle se mostrará aquí cuando elijas uno de la lista.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </StickyBox>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}