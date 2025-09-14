import {Box, Typography} from "@mui/material";
import React from "react";

export default function EmptySection({ message = "No hay elementos para mostrar" }) {
  return (
    <Box sx={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 2 }}>
      <img src={'/empty-spaces.svg'} width={'300px'} style={{ marginBottom: 16 }} />
      {/*<Typography*/}
      {/*  variant="body1"*/}
      {/*  color="text.secondary"*/}
      {/*  sx={{ fontWeight: 'bold' }}*/}
      {/*>*/}
      {/*  {message}*/}
      {/*</Typography>*/}
    </Box>
  );
}