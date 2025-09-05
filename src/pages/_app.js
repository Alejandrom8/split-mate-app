import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeLight } from '../components/Theme';
import {SnackbarProvider} from "notistack";
import {CacheProvider} from "@emotion/react";
import Head from "next/head";
import createEmotionCache from '../createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return <CacheProvider value={emotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={ThemeLight}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}               // máximo número de snackbars visibles
          autoHideDuration={3000}    // tiempo en ms
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
  </CacheProvider>
}
