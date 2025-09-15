import React from 'react';
import {Box, CircularProgress} from "@mui/material";

export default function LoadingSection() {
  return <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CircularProgress />
  </Box>;
}