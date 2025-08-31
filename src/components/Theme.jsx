// theme/splitMateTheme.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseShape = {
  borderRadius: 14, // juvenil y suave
};

const brand = {
  primary: '#1FA2A7',
  secondary: '#1D3B53',
  accent: '#FFE066',
  success: '#2EC4B6',
  info: '#4DA3FF',
  error: '#F36D6D',
  gray900: '#0F172A',
  gray700: '#334155',
  gray500: '#64748B',
  gray300: '#CBD5E1',
  gray100: '#F1F5F9',
  gray50: '#F8FAFC',
};

const commonTypography = {
  fontFamily: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'`,
  h1: { fontWeight: 800, letterSpacing: '-0.02em' },
  h2: { fontWeight: 800, letterSpacing: '-0.02em' },
  h3: { fontWeight: 700, letterSpacing: '-0.01em' },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
  subtitle1: { fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
};

const componentsOverrides = (mode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      ':root': {
        '--sm-accent': brand.accent,
        '--sm-primary': brand.primary,
      },
      body: {
        background:
          mode === 'light'
            ? `linear-gradient(180deg, ${brand.gray50} 0%, #FFFFFF 100%)`
            : `linear-gradient(180deg, #0B1220 0%, ${brand.gray900} 100%)`,
      },
      '::selection': {
        backgroundColor: brand.accent,
        color: '#0C0C0C',
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: baseShape.borderRadius,
        paddingInline: 16,
      },
      containedPrimary: {
        background: `linear-gradient(180deg, ${brand.primary} 0%, #138A8F 100%)`,
        ':hover': { filter: 'brightness(0.95)' },
      },
      outlined: {
        borderWidth: 2,
      },
    },
    variants: [
      {
        props: { variant: 'contained', color: 'secondary' },
        style: {
          background: brand.secondary,
          color: '#FFFFFF',
          ':hover': { background: '#162C3D' },
        },
      },
      {
        props: { variant: 'soft' }, // variante personalizada
        style: {
          backgroundColor: 'rgba(31,162,167,0.10)',
          color: brand.primary,
          borderRadius: baseShape.borderRadius,
        },
      },
    ],
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        borderRadius: baseShape.borderRadius,
        margin: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: baseShape.borderRadius + 4,
        border: `1px solid ${mode === 'light' ? brand.gray100 : '#1F2937'}`,
        boxShadow:
          mode === 'light'
            ? '0 8px 30px rgba(2, 28, 45, 0.06)'
            : '0 8px 30px rgba(0,0,0,0.45)',
      },
    },
  },
  MuiTextField: {
    defaultProps: { size: 'medium' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: baseShape.borderRadius,
        ':hover .MuiOutlinedInput-notchedOutline': {
          borderColor: brand.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: brand.primary,
          borderWidth: 2,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: baseShape.borderRadius },
      colorPrimary: {
        backgroundColor: 'rgba(31,162,167,0.15)',
        color: brand.primary,
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: baseShape.borderRadius,
        fontWeight: 600,
      },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: {
        borderRadius: baseShape.borderRadius,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: mode === 'light' ? brand.gray100 : '#1F2937',
      },
    },
  },
});

const splitMateLight = createTheme({
  palette: {
    mode: 'light',
    primary: { main: brand.primary, contrastText: '#FFFFFF' },
    secondary: { main: brand.secondary, contrastText: '#FFFFFF' },
    success: { main: brand.success },
    warning: { main: brand.accent, contrastText: '#0C0C0C' },
    info: { main: brand.info },
    error: { main: brand.error },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: brand.gray900,
      secondary: brand.gray700,
    },
    divider: brand.gray100,
  },
  shape: baseShape,
  typography: commonTypography,
  components: componentsOverrides('light'),
});

const splitMateDark = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: brand.primary, contrastText: '#0A0F14' },
    secondary: { main: brand.secondary, contrastText: '#FFFFFF' },
    success: { main: brand.success },
    warning: { main: brand.accent, contrastText: '#0C0C0C' },
    info: { main: brand.info },
    error: { main: brand.error },
    background: {
      default: '#0B1220',
      paper: '#0F172A',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#A5B4CF',
    },
    divider: '#1F2937',
  },
  shape: baseShape,
  typography: commonTypography,
  components: componentsOverrides('dark'),
});

export const ThemeLight = responsiveFontSizes(splitMateLight);
export const ThemeDark = responsiveFontSizes(splitMateDark);
