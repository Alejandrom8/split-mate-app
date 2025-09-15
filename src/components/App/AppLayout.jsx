import React from 'react';
import {useMediaQuery, useTheme} from "@mui/material";
import SplitMateAppBar from "@/components/App/SplitMateAppBar";
import {useRouter} from "next/router";

export default function AppLayout({ children }) {
  const router = useRouter();

  return <>
    <SplitMateAppBar />
    {children}
  </>
};