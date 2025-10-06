import {useMediaQuery, useTheme} from "@mui/material";
import SplitMateAppBar from "@/components/App/SplitMateAppBar";
import {useRouter} from "next/router";
import MobileBottomNavNotched from './MobileBottomNav';
import CreateSpeedDial from "@/components/App/CreateSpeedDial";
import {SpeedDialProvider} from "@/context/SpeedDialContext";

export default function AppLayout({ 
  children, authHeader, onSpaceCreated, onTicketUploaded, spaceId
}) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  return <SpeedDialProvider
    authHeader={authHeader}
    spaceId={spaceId}
    onSpaceCreated={onSpaceCreated}
    onTicketUploaded={onTicketUploaded}
  >
    {
      isMd && <>
        <SplitMateAppBar />
        <CreateSpeedDial />
      </>
    }
    {children}
    {
      !isMd && <MobileBottomNavNotched />
    }
  </SpeedDialProvider>
};