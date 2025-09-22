// pages/index.js
import * as React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Link,
  Drawer,
  List,
  Grid, IconButton, ListItem, ListItemButton, ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShareIcon from "@mui/icons-material/Share";
import BoltIcon from "@mui/icons-material/Bolt";
import v1Manager from "@/shared/v1Manager";
import nookies from "nookies";
import MenuIcon from "@mui/icons-material/Menu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PsychologyIcon from "@mui/icons-material/Psychology";

const brand = {
  primary: "#4C6FFF",
  primaryDark: "#295BFF",
  secondary: "#12172A",
  accent: "#FFE500",
  lilac: "#A78BFA",
  pink: "#FF4D8D",
  gray900: "#0B1220",
  gray700: "#334155",
  gray500: "#6B7280",
  gray300: "#D1D5DB",
  gray100: "#F3F6FA",
  gray50: "#F8FAFF",
};

// --- NavBar ---
function NavBar() {
  const [open, setOpen] = React.useState(false);
  const toggle = (v) => () => setOpen(v);

  const links = [
    { label: "Características", href: "#features" },
    { label: "Cómo funciona", href: "#como-funciona" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        color: brand.gray900,
        borderRadius: 0,
        m: 0,
      }}
    >
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          {/* Logo / Brand */}
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.pink})`,
                flexShrink: 0,
              }}
            />
            <Typography fontWeight={800}>SplitMate</Typography>
          </Stack>

          {/* Botón menú (mobile) */}
          <IconButton
            edge="end"
            onClick={toggle(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>

          {/* Acciones (desktop) */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {links.map((l) => (
              <Button key={l.href} component={NextLink} href={l.href} color="inherit">
                {l.label}
              </Button>
            ))}
            <Button
              component={NextLink}
              href={"/login"}
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 2.5,
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.pink})`,
                ":hover": { filter: "brightness(1.05)" },
              }}
            >
              Iniciar sesión
            </Button>
          </Stack>
        </Toolbar>
      </Container>

      {/* Drawer (mobile) */}
      <Drawer anchor="right" open={open} onClose={toggle(false)}>
        <Box
          sx={{ width: 280, p: 2 }}
          role="presentation"
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "6px",
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.pink})`,
              }}
            />
            <Typography fontWeight={800}>SplitMate</Typography>
          </Stack>

          <Divider sx={{ mb: 1 }} />

          <List>
            {links.map((l) => (
              <ListItem key={l.href} disablePadding>
                <ListItemButton component={NextLink} href={l.href}>
                  <ListItemText primary={l.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                component={NextLink}
                href={"/login?mode=signup"}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  bgcolor: "rgba(76,111,255,0.12)",
                }}
              >
                <ListItemText
                  primary="Iniciar sesión"
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

// --- Hero ---
function Hero() {
  return (
    <Box
      sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 12 },
        color: 'white !Important',
        background: `linear-gradient(135deg, #4C6FFF 0%, #FF4D8D 50%, #FFE500 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Texto / CTA */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Chip
                icon={<AutoAwesomeIcon color={'#fff'}/>}
                label="Impulsado por IA"
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: 'white',
                  fontWeight: 700,
                }}
              />

              <Typography
                variant="h2"
                fontWeight={900}
                lineHeight={1.1}
                sx={{
                  color: "#fff", // texto base en blanco para máxima legibilidad
                }}
              >
                Convierte fotos de tickets en{" "}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(90deg, ${brand.accent}, ${brand.lilac})`,
                    backgroundClip: "text",
                    color: "transparent",
                    display: "inline-block",
                    textShadow: "none", // mantiene limpio el span
                  }}
                >
                  cuentas digitales
                </Box>{" "}
                con IA.
              </Typography>

              <Typography
                mt={1}
                color="white"
                sx={{ fontSize: { xs: 16, md: 18 } }}
              >
                Sube una foto del ticket y nuestra IA lo transforma en ítems,
                precios y cantidades para dividir entre tus amigos en segundos.
              </Typography>

              <Stack direction="row" spacing={0} flexWrap="wrap" gap={1}>
                <Chip icon={<PsychologyIcon color={'#fff'}/>} label="OCR + Comprensión de ítems" sx={{ color: 'white' }}/>
                <Chip icon={<BoltIcon color={'#fff'}/>} label="Extracción en segundos" sx={{ color: 'white' }}/>
                <Chip icon={<ReceiptLongIcon color={'#fff'}/>} label="Totales y propina automáticos" sx={{ color: 'white' }}/>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mt={1}>
                <Button
                  component={NextLink}
                  href="/login?next=/space/new"
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    // botón principal: fondo sólido blanco + texto oscuro
                    backgroundColor: "#fff",
                    color: '#fff',
                    fontWeight: 700,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    ":hover": {
                      backgroundColor: brand.gray100,
                    },
                  }}
                >
                  Probar con mi ticket
                </Button>

                <Button
                  component={NextLink}
                  href="#como-funciona"
                  size="large"
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    // outlined con borde blanco + texto blanco
                    borderColor: "#fff",
                    color: "#fff",
                    fontWeight: 700,
                    ":hover": {
                      borderColor: brand.gray100,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Ver cómo funciona
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Mock de transformación con IA */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Box
                sx={{
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <Stack spacing={2}>
                  {/* Paso 1: Foto */}
                  <Card
                    variant="outlined"
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: brand.secondary }}>
                          <CameraAltIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={800}>Foto del ticket</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Sube JPG/PNG o arrastra el archivo aquí.
                          </Typography>
                        </Box>
                        <Chip size="small" label="Subido" color="success" />
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Paso 2: IA trabajando */}
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: brand.lilac }}>
                          <PsychologyIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={800}>
                            IA extrayendo ítems
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Detectando descripciones, cantidades y precios…
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label="≈98% accuracy"
                          sx={{ bgcolor: "rgba(76,111,255,0.12)", color: brand.primary }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Paso 3: Lista estructurada */}
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography fontWeight={800}>Ticket digital</Typography>
                        <Chip
                          icon={<ReceiptLongIcon />}
                          label="Listo para dividir"
                          color="primary"
                          variant="outlined"
                        />
                      </Stack>

                      <Stack spacing={1.2} mt={1.5}>
                        {[
                          { name: "2× Taco al pastor", price: 120 },
                          { name: "1× Quesadilla", price: 85 },
                          { name: "3× Refresco", price: 90 },
                        ].map((it, i) => (
                          <Stack
                            key={i}
                            direction="row"
                            justifyContent="space-between"
                          >
                            <Typography>{it.name}</Typography>
                            <Typography fontWeight={700}>
                              ${it.price.toFixed(2)}
                            </Typography>
                          </Stack>
                        ))}
                        <Box
                          sx={{
                            my: 1,
                            height: 1,
                            background:
                              "repeating-linear-gradient(90deg, rgba(0,0,0,.35), rgba(0,0,0,.35) 6px, transparent 6px, transparent 12px)",
                          }}
                        />
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight={700}>Total</Typography>
                          <Typography fontWeight={900} color={brand.primary}>
                            $295.00
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// --- SECCIÓN: Cómo funciona ---
function HowItWorks() {
  return (
    <Box id="como-funciona" sx={{ py: { xs: 8, md: 10 }, background: brand.gray50 }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Lista de pasos */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={900}>
              ¿Cómo funciona?
            </Typography>
            <Stack spacing={3} mt={2}>
              {[
                {
                  step: "1",
                  icon: <CameraAltIcon />,
                  title: "Sube una foto del ticket",
                  text: "Carga una imagen o PDF de tu ticket. Puedes incluso tomar una foto desde tu celular.",
                },
                {
                  step: "2",
                  icon: <PsychologyIcon />,
                  title: "La IA lo transforma",
                  text: "Nuestro modelo detecta automáticamente los ítems, precios, impuestos y propina.",
                },
                {
                  step: "3",
                  icon: <ReceiptLongIcon />,
                  title: "Obtén el ticket digital",
                  text: "Visualiza el ticket ya estructurado, listo para asignar a cada amigo.",
                },
                {
                  step: "4",
                  icon: <ShareIcon />,
                  title: "Asigna y comparte",
                  text: "Divide los ítems entre tus amigos y comparte el balance en segundos.",
                },
              ].map((it, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                >
                  <Avatar
                    sx={{
                      bgcolor: brand.lilac,
                      color: "#fff",
                      width: 36,
                      height: 36,
                    }}
                  >
                    {it.icon}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800}>{it.title}</Typography>
                    <Typography color="text.secondary">{it.text}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Vista demo balance */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Typography fontWeight={800} mb={1}>
                Vista de balance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                {[
                  { user: "Roni", you: false, amount: "-$320.00" },
                  { user: "Magy", you: false, amount: "-$180.00" },
                  { user: "Alex (tú)", you: true, amount: "+$500.00" },
                ].map((row, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      color={row.you ? brand.primary : "text.primary"}
                      fontWeight={700}
                    >
                      {row.user}
                    </Typography>
                    <Typography
                      fontWeight={800}
                      sx={{
                        color: row.amount.startsWith("+")
                          ? "success.main"
                          : "error.main",
                      }}
                    >
                      {row.amount}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// --- SECCIÓN: CTA ---
function CTA() {
  return (
    <Box id="cta" sx={{ py: { xs: 8, md: 10 }, background: `linear-gradient(135deg, ${brand.primary}, ${brand.pink})` }}>
      <Container>
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "rgba(255,255,255,0.86)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography variant="h4" fontWeight={900}>
            ¿Listo para dividir sin dramas?
          </Typography>
          <Typography color="text.secondary" mt={1} mb={3}>
            Crea tu espacio en menos de un minuto. Es gratis.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
            <Button
              component={NextLink}
              href="/login?next=/space/new"
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, px: 3, background: brand.primary }}
            >
              Crear mi espacio
            </Button>
            <Button
              component={NextLink}
              href="/docs/guia-rapida"
              variant="outlined"
              size="large"
              sx={{ borderRadius: 3 }}
            >
              Ver guía rápida
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

// --- Features ---
function Features() {
  return (
    <Container id="features" sx={{ py: { xs: 8, md: 10 } }}>
      <Typography variant="h4" fontWeight={900} textAlign="center">
        Todo lo que necesitas para dividir gastos
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1} mb={4}>
        Simple, visual y pensado para grupos.
      </Typography>

      <Grid container spacing={3}>
        {[
          {
            icon: <ReceiptLongIcon />,
            title: "Sube tu ticket",
            desc: "Arrastra la foto o PDF y lo parseamos en segundos.",
          },
          {
            icon: <GroupsIcon />,
            title: "Asigna por persona",
            desc: "Selecciona ítems por amigo o divide por porcentajes.",
          },
          {
            icon: <AccessTimeIcon />,
            title: "Cálculo al instante",
            desc: "Impuestos, propinas y redondeos se aplican automático.",
          },
        ].map((f, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                height: "100%",
                ":hover": { boxShadow: "0 10px 30px rgba(11,18,32,0.08)" },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: brand.primary,
                    color: "#fff",
                    width: 40,
                    height: 40,
                    mb: 1,
                  }}
                >
                  {f.icon}
                </Avatar>
                <Typography variant="h6" fontWeight={800}>
                  {f.title}
                </Typography>
                <Typography color="text.secondary" mt={0.5}>
                  {f.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// --- Footer ---
function Footer() {
  return (
    <Box sx={{ py: 5, background: "#fff" }}>
      <Container>
        <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{ width: 22, height: 22, borderRadius: "6px", background: `linear-gradient(135deg, ${brand.primary}, ${brand.pink})` }}
            />
            <Typography fontWeight={800}>SplitMate</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Link component={NextLink} href="/privacy" color="inherit" underline="hover">Privacidad</Link>
            <Link component={NextLink} href="/terms" color="inherit" underline="hover">Términos</Link>
            <Link component={NextLink} href="mailto:hola@splitmate.app" color="inherit" underline="hover">Contacto</Link>
          </Stack>
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
          © {new Date().getFullYear()} SplitMate. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}


export default function Landing() {
  const site = "https://splitmate.app"; // cambia a tu dominio
  const ogImage = `${site}/og-image.png`; // pon tu imagen OG real (1200x630)

  return (
    <>
      <Head>
        <title>SplitMate — divide gastos con tus amigos</title>
        <meta name="description" content="Sube tu ticket, asigna ítems por persona y comparte el balance en segundos. La forma más juvenil de dividir gastos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="SplitMate — divide gastos con tus amigos" />
        <meta property="og:description" content="Sube tu ticket, asigna ítems y comparte el balance en segundos." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={site} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SplitMate — divide gastos con tus amigos" />
        <meta name="twitter:description" content="Sube tu ticket, asigna ítems y comparte el balance en segundos." />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <NavBar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get({ req: ctx.req });
    const at = cookies.at;

    if (at) {
      return {
        redirect: {
          destination: '/home',
          permanent: false,
        }
      };
    }

  } catch {
    //pass
  }

  return { props: {} };
};