import * as React from "react";
import TicketDetail from '../../components/TicketDetail';
import {withAuth} from "@/shared/withAuth";
import v1Manager from "@/shared/v1Manager";

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