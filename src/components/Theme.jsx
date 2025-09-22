// theme/splitMateVoltTheme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Paleta vibrante (electric blue como primario)
const brand = {
  primary: "#4C6FFF",      // electric blue
  primaryDark: "#295BFF",
  secondary: "#12172A",    // navy profundo para contraste
  accent: "#FFE500",       // amarillo neon (resalta CTAs/selection)
  lilac: "#A78BFA",        // lavanda
  pink: "#FF4D8D",         // rosa fuerte
  success: "#22C55E",
  info: "#60A5FA",
  error: "#FF5C5C",
  gray900: "#0B1220",
  gray700: "#334155",
  gray500: "#6B7280",
  gray300: "#D1D5DB",
  gray100: "#F3F6FA",
  gray50:  "#F8FAFF",
};

const baseShape = { borderRadius: 18 };

const typography = {
  fontFamily:
    `'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`,
  h1: { fontWeight: 900, letterSpacing: "-0.025em" },
  h2: { fontWeight: 800, letterSpacing: "-0.02em" },
  h3: { fontWeight: 800, letterSpacing: "-0.02em" },
  h4: { fontWeight: 700, letterSpacing: "-0.01em" },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 700 },
  subtitle1: { fontWeight: 600 },
  button: { textTransform: "none", fontWeight: 800, letterSpacing: 0.1 },
};

// Sombras suaves
const shadows = [
  "none",
  "0 6px 20px rgba(2,10,30,0.05)",
  "0 10px 28px rgba(2,10,30,0.06)",
  "0 14px 36px rgba(2,10,30,0.08)",
  "0 18px 44px rgba(2,10,30,0.10)",
  ...Array(20).fill("0 18px 44px rgba(2,10,30,0.10)"),
];

const splitMateVolt = createTheme({
  palette: {
    mode: "light",
    primary: { main: brand.primary, dark: brand.primaryDark, contrastText: "#FFFFFF" },
    secondary: { main: brand.secondary, contrastText: "#FFFFFF" },
    success: { main: brand.success },
    warning: { main: brand.accent, contrastText: "#0B1220" },
    info: { main: brand.info },
    error: { main: brand.error },
    background: {
      default: brand.gray500,
      paper: "rgba(255,255,255,1)", // base tipo glass
    },
    text: {
      primary: brand.gray900,
      secondary: brand.gray700,
    },
    divider: "rgba(11,18,32,0.06)",
  },
  shape: baseShape,
  typography,
  shadows,
  transitions: {
    duration: { shortest: 120, shorter: 160, short: 200, standard: 240 },
    easing: { easeInOut: "cubic-bezier(.4,0,.2,1)" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--sm-accent": brand.accent,
          "--sm-primary": brand.primary,
        },
        body: {
          // Fondo con gradients sutiles en azul/lila
          background:
            `radial-gradient(1000px 500px at 90% -50%, rgba(167,139,250,0.18), transparent 60%),
             radial-gradient(900px 400px at -10% 120%, rgba(76,111,255,0.16), transparent 55%),
             linear-gradient(180deg, #FBFDFF 0%, #F6FAFF 100%)`,
        },
        "::selection": {
          backgroundColor: brand.accent,
          color: brand.gray900,
        },
      },
    },

    // Botones con variantes "soft", "glass" y "gradient"
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: baseShape.borderRadius + 2,
          paddingInline: 16,
          transition: "transform .06s ease, filter .2s ease",
          ":active": { transform: "translateY(1px) scale(0.99)" },
          "&:focus-visible": {
            outline: `3px solid ${brand.accent}`,
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          background: `linear-gradient(180deg, ${brand.primary} 0%, ${brand.primaryDark} 100%)`,
          ":hover": { filter: "brightness(0.96)" },
        },
        outlined: { borderWidth: 2, ":hover": { borderWidth: 2 } },
      },
      variants: [
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            background: `linear-gradient(180deg, ${brand.secondary} 0%, #0C1020 100%)`,
            color: "#fff",
            ":hover": { filter: "brightness(1.08)" },
          },
        },
        {
          props: { variant: "soft" },
          style: {
            backgroundColor: "rgba(76,111,255,0.14)",
            color: brand.primary,
            borderRadius: baseShape.borderRadius + 2,
            ":hover": { backgroundColor: "rgba(76,111,255,0.18)" },
          },
        },
        {
          props: { variant: "glass" },
          style: {
            background: "rgba(255,255,255,0.38)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.6)",
            color: brand.gray900,
            ":hover": { background: "rgba(255,255,255,0.48)" },
          },
        },
        {
          props: { variant: "gradient" },
          style: {
            background: 'linear-gradient(135deg, #4C6FFF, #FF4D8D)',
            ':hover': { filter: 'brightness(1.05)' },
            color: 'white',
          },
        },
      ],
    },

    // AppBar glass
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: baseShape.borderRadius,
          margin: 8,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 8px 20px rgba(11,18,32,0.10)",
        },
      },
    },

    // Cards con glass suave
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: baseShape.borderRadius + 6,
          background: "rgba(255,255,255,1)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 10px 30px rgba(11,18,32,0.08), 0 1px 0 0 rgba(255,255,255,0.6) inset",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: baseShape.borderRadius + 4, backgroundImage: "none" },
      },
    },

    // Inputs con ring azul
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: baseShape.borderRadius + 2,
          ":hover .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: brand.primary,
            borderWidth: 2,
            boxShadow: `0 0 0 3px rgba(76,111,255,0.20)`,
          },
          backgroundColor: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(6px)",
        },
      },
      defaultProps: { size: "medium" },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999 },
        colorPrimary: {
          backgroundColor: "rgba(76,111,255,0.16)",
          color: brand.primary,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: baseShape.borderRadius,
          fontWeight: 700,
          background: brand.gray900,
        },
      },
    },

    MuiSnackbarContent: {
      styleOverrides: { root: { borderRadius: baseShape.borderRadius + 2 } },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgba(11,18,32,0.06)" } },
    },

    // Link con subrayado animado
    MuiLink: {
      styleOverrides: {
        root: (ctx) => {
          const c = ctx.theme.palette.primary.main;
          return {
            position: "relative",
            color: c,
            textDecoration: "none",
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -2,
              height: 2,
              background: c,
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: "transform .18s ease",
            },
            "&:hover::after": { transform: "scaleX(1)" },
            "&:visited": { color: ctx.theme.palette.grey[600] },
            "&:active": { color: ctx.theme.palette.error.main },
          };
        },
      },
    },
  },
});

export const ThemeVolt = responsiveFontSizes(splitMateVolt);
export default ThemeVolt;