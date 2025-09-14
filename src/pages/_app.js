import {ThemeProvider, CssBaseline, GlobalStyles} from '@mui/material';
import { ThemeLight } from '../components/Theme';
import {SnackbarProvider} from "notistack";
import {CacheProvider} from "@emotion/react";
import Head from "next/head";
import createEmotionCache from '../createEmotionCache';
import SplitMateAppBar from "@/components/App/SplitMateAppBar";
import * as React from "react";
import {useRouter} from "next/router";
import {AuthProvider} from "@/context/AuthContext";
import ProgressBar from "@/components/App/ProgressBar";
import {SpeedDialProvider} from "@/context/SpeedDialContext";

const clientSideEmotionCache = createEmotionCache();

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return <CacheProvider value={emotionCache}>
    <AuthProvider>
      <SpeedDialProvider>
        <ThemeProvider theme={ThemeLight}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <SplitMateAppBar />
            <GlobalStyles styles={(theme) => ({
              "#nprogress": { pointerEvents: "none" },
              "#nprogress .bar": {
                background: theme.palette.primary.main,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: 3,
                zIndex: 2000, // 👈 más alto que AppBar
              },
              "#nprogress .peg": {
                boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
                opacity: 1,
              },
              "#nprogress .spinner": { display: "none" },
            })} />
            <ProgressBar />
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </SpeedDialProvider>
    </AuthProvider>
  </CacheProvider>
}
