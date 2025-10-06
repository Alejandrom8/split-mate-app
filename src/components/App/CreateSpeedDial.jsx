import * as React from "react";
import { Box } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useSpeedDial} from "@/context/SpeedDialContext";

export default function CreateSpeedDial() {
  const { onOpenCreateSpace, onOpenUploadTicket } = useSpeedDial();

  return (
    <Box
      sx={{
        position: "fixed",
        right: 38,
        bottom: 38,
        zIndex: (theme) => theme.zIndex.tooltip + 1,
      }}
    >
      <SpeedDial
        color={'secondary'}
        ariaLabel="Acciones rápidas"
        icon={
          <SpeedDialIcon
            icon={<AddIcon />}
            openIcon={<AddIcon />}
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 8px 24px 0px',
            }}
          />
        }
      >
        <SpeedDialAction
          key="crear-espacio"
          icon={<CreateNewFolderIcon />}
          tooltipTitle="Crear nuevo espacio"
          onClick={onOpenCreateSpace}
        />
        <SpeedDialAction
          key="crear-ticket"
          icon={<CloudUploadIcon />}
          tooltipTitle="Subir ticket"
          onClick={onOpenUploadTicket}
        />
      </SpeedDial>
    </Box>
  );
}