import * as React from "react";
import TicketDetail from '../../../../components/TicketDetail';
import {withAuth} from "@/shared/withAuth";
import v1Manager from "@/shared/v1Manager";
import {useState} from "react";
import {Box, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRouter} from "next/router";

function TicketDetailPage({ isOwner, spaceId, initialData }) {
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
    <Box sx={{ py: 1, width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', position: 'fixed', top: 0, left: 0, backgroundColor: 'white', zIndex: 1000 }}>
      <Button
        onClick={handleCancel}
        startIcon={<ArrowBackIcon />}
        variant="text"
        sx={{ color: "text.primary" }}
      >
        Regresar
      </Button>
    </Box>
    <Box sx={{ mb: 8 }} />
    <TicketDetail
      selectable={isSelectable}
      editable={isEditable}
      spaceId={spaceId}
      ticket={initialData}
      onEdit={handleEdit}
      onShare={handleShare}
      onSplit={handleSplit}
    />
  </>
}

export const getServerSideProps = withAuth(async ({ authHeader, ...ctx }) => {
  try {
    const { id, ticket_id } = ctx.params;
    const res = await v1Manager.get(`/v1/tickets/${ticket_id}`, {}, { headers: authHeader.headers });
    if (!res?.data?.success) {
      throw new Error(`Error fetching ticket: ${res.status}`);
    }
    const userRes = await v1Manager.get('/v1/users/me', {}, authHeader);
    const currentUser = userRes.data.data;
    const ticket = res.data.data;
    const isOwner = ticket.owner.user_id === currentUser.id;
    return {
      props: {
        isOwner,
        spaceId: id,
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