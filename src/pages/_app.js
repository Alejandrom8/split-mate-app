import "@/styles/globals.css";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ThemeLight } from '../components/Theme';

export default function App({ Component, pageProps }) {
  return <CssBaseline>
      <ThemeProvider theme={ThemeLight}>
        <Component {...pageProps} />;
    </ThemeProvider>
  </CssBaseline>
}
