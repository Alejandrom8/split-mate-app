import React from 'react';
import {Box, Stack, Typography} from "@mui/material";
import NextLink from 'next/link';

export default function AppTitle({ href = "" }) {

  const logo = (
    <Stack direction={'row'} spacing={1} alignItems='center'>
      <img src={'/logo.svg'} width={'35px'} alt='Kuadramos logo'/>
      <Typography
        color='primary'
        sx={{ flexGrow: 1, fontWeight: 800, p: 0, m: 0, fontSize: '1.2rem', lineHeight: 0, letterSpacing: 0.5 }} 
        gutterBottom={false}
      >
        Divi
      </Typography>
    </Stack>
  );

  if (href) return <NextLink href={href} style={{ textDecoration: 'none' }}>{logo}</NextLink>;
  return logo;
}