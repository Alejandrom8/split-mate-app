import * as React from "react";
import TicketDetail from '../../components/TicketDetail';

export default function TicketDetailPage() {
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

  const handleEdit = () => alert("Editar ticket");
  const handleShare = () => alert("Compartir ticket");
  const handleSplit = () => alert("Ir a dividir gastos");

  return (
    <TicketDetail
      ticket={mockTicket}
      onEdit={handleEdit}
      onShare={handleShare}
      onSplit={handleSplit}
    />
  );
}