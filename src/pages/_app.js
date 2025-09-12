import {ThemeProvider, CssBaseline, Toolbar} from '@mui/material';
import { ThemeLight } from '../components/Theme';
import {SnackbarProvider} from "notistack";
import {CacheProvider} from "@emotion/react";
import Head from "next/head";
import createEmotionCache from '../createEmotionCache';
import SplitMateAppBar from "@/components/App/SplitMateAppBar";
import * as React from "react";
import {useRouter} from "next/router";
import {AuthProvider} from "@/context/AuthContext";

const clientSideEmotionCache = createEmotionCache();

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const isSignInPage = ['/login', '/logout'].find(path => path === router.pathname) !== undefined;

  return <CacheProvider value={emotionCache}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <AuthProvider initialUser={pageProps?.initialUser || null}>
      <ThemeProvider theme={ThemeLight}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}               // máximo número de snackbars visibles
          autoHideDuration={3000}    // tiempo en ms
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          {
            !isSignInPage && <SplitMateAppBar
              user={{ name: "Alex", avatarUrl: "https://i.pravatar.cc/200?img=68" }}
              onProfile={() => console.log("perfil")}
              onSettings={() => console.log("configuración")}
              onLogout={() => router.push("/logout")}
            />
          }
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  </CacheProvider>
}
