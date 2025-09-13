import React from 'react';

const SpeedDialContext = React.createContext(null);
export const useSpeedDial = () => React.useContext(SpeedDialContext);

export function SpeedDialProvider({ children }) {
  const [openCreateSpace, setOpenCreateSpace] = React.useState(false);
  const [openUploadTicket, setOpenUploadTicket] = React.useState(false);

  const onOpenCreateSpace = () => setOpenCreateSpace(true);
  const onCloseCreateSpace = () => setOpenCreateSpace(false);

    const onOpenUploadTicket = () => setOpenUploadTicket(true);
    const onCloseUploadTicket = () => setOpenUploadTicket(false);

    return (
    <SpeedDialContext.Provider value={{
      openCreateSpace, onOpenCreateSpace, onCloseCreateSpace,
      openUploadTicket, onOpenUploadTicket, onCloseUploadTicket,
    }}>
        {children}
    </SpeedDialContext.Provider>
    );
}