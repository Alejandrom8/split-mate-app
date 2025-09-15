import * as React from "react";
import TicketDetail from '../../components/TicketDetail';
import {withAuth} from "@/shared/withAuth";
import v1Manager from "@/shared/v1Manager";

const mockTicket = {
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
  notes: "Separamos postre entre todos. Revisar precio de bebidas.",
};

function TicketDetailPage({ initialData }) {
  const handleEdit = () => alert("Editar ticket");
  const handleShare = () => alert("Compartir ticket");
  const handleSplit = () => alert("Ir a dividir gastos");

  return (
    <TicketDetail
      ticket={initialData}
      onEdit={handleEdit}
      onShare={handleShare}
      onSplit={handleSplit}
    />
  );
}

export const getServerSideProps = withAuth(async ({ authHeader, ...ctx }) => {
  try {
    const { id } = ctx.params;
    const res = await v1Manager.get(`/v1/tickets/${id}`, {}, { headers: authHeader.headers });
    if (!res?.data?.success) {
      throw new Error(`Error fetching ticket: ${res.status}`);
    }
    const ticket = res.data.data;
    return {
      props: {
        initialData: ticket,
      }
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    }
  }
});

export default TicketDetailPage;