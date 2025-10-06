import React from 'react';
import CreateSpaceModal from '@/components/App/CreateSpaceModal';
import UploadTicketModal from '@/components/App/UploadTicketModal';
import { useAuth } from './AuthContext';

const SpeedDialContext = React.createContext(null);
export const useSpeedDial = () => React.useContext(SpeedDialContext);

export function SpeedDialProvider({ children, onSpaceCreated, onTicketUploaded, authHeader, spaceId }) {
  const [openCreateSpace, setOpenCreateSpace] = React.useState(false);
  const [openUploadTicket, setOpenUploadTicket] = React.useState(false);

  const onOpenCreateSpace = () => setOpenCreateSpace(true);
  const onCloseCreateSpace = () => setOpenCreateSpace(false);

  const onOpenUploadTicket = () => setOpenUploadTicket(true);
  const onCloseUploadTicket = () => setOpenUploadTicket(false);

  return (
    <SpeedDialContext.Provider
      value={{
        openCreateSpace,
        onOpenCreateSpace,
        onCloseCreateSpace,
        openUploadTicket,
        onOpenUploadTicket,
        onCloseUploadTicket,
      }}
    >
      {children}
      <CreateSpaceModal
        open={openCreateSpace}
        onClose={onCloseCreateSpace}
        onCreated={onSpaceCreated}
      />
      <UploadTicketModal
        _authHeader={authHeader}
        _spaceId={spaceId}
        open={openUploadTicket}
        onClose={onCloseUploadTicket}
        onCreated={onTicketUploaded}
      />
    </SpeedDialContext.Provider>
  );
}
