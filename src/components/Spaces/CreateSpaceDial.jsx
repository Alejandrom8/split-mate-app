import * as React from "react";
import { Box } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function CreateSpaceSpeedDial({ onCreate }) {
  return (
    <Box
      sx={{
        position: "fixed",
        right: 34,
        bottom: 44,
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
          />
        }
        // sx={{
        //   '& .MuiFab-primary': {
        //     backgroundColor: 'red', // tu color
        //     '&:hover': { backgroundColor: '#00796b' }, // hover
        //   },
        // }}
      >
        <SpeedDialAction
          key="crear-espacio"
          icon={<CreateNewFolderIcon />}
          tooltipTitle="Crear nuevo espacio"
          onClick={onCreate}
        />
        <SpeedDialAction
          key="crear-ticket"
          icon={<CloudUploadIcon />}
          tooltipTitle="Subir ticket"
          onClick={() => {}}
        />
      </SpeedDial>
    </Box>
  );
}