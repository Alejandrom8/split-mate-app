import React from 'react';
import {Box, Typography} from "@mui/material";

export default function AppTitle() {
  return <>
    <Box
      aria-label="Split Mate"
      sx={{
        width: 28,
        height: 28,
        borderRadius: "8px",
        mr: 1,
      }}
    >
      <img src={'/logo.png'} width={'28px'} height={'28px'} />
    </Box>
    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
      Split Mate
    </Typography>
  </>
}