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
        bgcolor: "secondary.main",
        mr: 1,
      }}
    />
    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
      Split Mate
    </Typography>
  </>
}