import * as React from "react";
import TicketDetail from '../../../../components/TicketDetail';
import {withAuth} from "@/shared/withAuth";
import v1Manager from "@/shared/v1Manager";
import {useState} from "react";
import {Box, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRouter} from "next/router";

function TicketDetailPage({ isOwner, spaceId, initialData, initialAssignments, initialTicketBalance }) {
  const handleEdit = () => alert("Editar ticket");
  const handleShare = () => alert("Compartir ticket");
  const handleSplit = () => alert("Ir a dividir gastos");
  const [isEditable, setIsEditable] = useState(isOwner && initialData?.validation_status === 'hidden');
  const [isSelectable, setIsSelectable] = useState(initialData?.validation_status === 'in_build');
  const router = useRouter();

  const handleCancel = () => {
    router.push(`/space/${spaceId}`);
  };

  return <>
    <TicketDetail
      selectable={isSelectable}
      editable={isEditable}
      spaceId={spaceId}
      ticket={initialData}
      assignments={initialAssignments}
      balance={initialTicketBalance}
      onEdit={handleEdit}
      onShare={handleShare}
      onSplit={handleSplit}
    />
  </>
}

export const getServerSideProps = withAuth(async ({ authHeader, ...ctx }) => {
  try {
    const { id: spaceId, ticketId } = ctx.params;

    if (!spaceId || !ticketId) {
      return {
        notFound: true,
      }
    }

    const res = await v1Manager.get(`/v1/tickets/${ticketId}`, {}, { headers: authHeader.headers });
    if (!res?.data?.success) {
      throw new Error(`Error fetching ticket: ${res.status}`);
    }
    const userRes = await v1Manager.get('/v1/users/me', {}, authHeader);
    const currentUser = userRes.data.data;
    const ticket = res.data.data;
    const isOwner = ticket.owner.user_id === currentUser.id;

    const assignmentsRes = await v1Manager.get(`/v1/tickets/${ticketId}/assignments-summary`, {}, { headers: authHeader.headers });
    const assignments = assignmentsRes.data.data;

    const ticketBalanceRes = await v1Manager.get(`/v1/balance/${spaceId}/ticket/${ticketId}`, {}, { headers: authHeader.headers });
    const ticketBalance = ticketBalanceRes.data.data;

    return {
      props: {
        isOwner,
        spaceId,
        initialData: ticket,
        initialAssignments: assignments,
        initialTicketBalance: ticketBalance,
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