import * as React from "react";
import { Box } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

export default function CreateSpaceSpeedDial({ onCreate }) {
  return (
    <Box
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: (theme) => theme.zIndex.tooltip + 1,
      }}
    >
      <SpeedDial
        ariaLabel="Acciones rápidas"
        icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<AddIcon />} />}
      >
        <SpeedDialAction
          key="crear-espacio"
          icon={<CreateNewFolderIcon />}
          tooltipTitle="Crear nuevo espacio"
          onClick={onCreate}
        />
      </SpeedDial>
    </Box>
  );
}