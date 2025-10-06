'use client';

import * as React from 'react';
import {
  Box,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
  Tooltip,
  ClickAwayListener,
  useTheme,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import {useRouter} from "next/router";
import {useSpeedDial} from "@/context/SpeedDialContext";

export default function MobileBottomNavNotched() {
  const router = useRouter();
  const pathname = router.pathname;
  const theme = useTheme();

  const {
    openCreateSpace, onOpenCreateSpace, onCloseCreateSpace,
    openUploadTicket, onOpenUploadTicket, onCloseUploadTicket,
  } = useSpeedDial();

  const [open, setOpen] = React.useState(false);
  const barRef = React.useRef(null);
  const [barW, setBarW] = React.useState(0);

  const current = React.useMemo(() => {
    if (pathname?.startsWith('/profile')) return '/profile';
    return '/';
  }, [pathname]);

  // Tamaños / diseño
  const BAR_H = 64;             // alto de la barra
  const RADIUS = 32;            // radio del notch (curva) — ajusta según FAB
  const NOTCH_GAP = 6;          // holgura extra para que “abrace” al FAB
  const NOTCH_R = RADIUS + NOTCH_GAP;

  const MAIN_FAB = 56;          // diámetro FAB central
  const ACTION_FAB = 44;        // diámetro botones de acción
  const FAN_RADIUS = 88;        // distancia de acciones respecto al FAB
  const START_DEG = 115;        // abanico: ángulo inicial (arriba-izq)
  const END_DEG   = 65;         // abanico: ángulo final (arriba-der)

  const actions = [
    {
      key: 'create-space',
      label: 'Crear espacio',
      icon: <CreateNewFolderIcon />,
      onClick: () => {
        setOpen(false);
        onOpenCreateSpace();
      }
    },
    {
      key: 'upload-ticket',
      label: 'Subir ticket',
      icon: <ReceiptLongOutlinedIcon />,
      onClick: () => {
        setOpen(false);
        onOpenUploadTicket();
      }
    },
  ];

  // Medir ancho del contenedor para centrar el notch
  React.useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBarW(el.clientWidth));
    ro.observe(el);
    setBarW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const toggleOpen = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  // Calcular ángulos equiespaciados
  const angles = React.useMemo(() => {
    if (actions.length === 1) return [90];
    const steps = actions.length - 1;
    return actions.map((_, i) => START_DEG + ((END_DEG - START_DEG) * i) / steps);
  }, [actions.length]);

  // Utilidad polar → offset
  const polarToOffset = (deg, radius = FAN_RADIUS) => {
    const rad = (deg * Math.PI) / 180;
    return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
  };

  // Path del notch con SVG: rect redondeado + círculo central restado (evenodd)
  const notchPathD = React.useMemo(() => {
    const w = Math.max(barW, 320);         // mínimo razonable
    const h = BAR_H;

    const rx = 16;                          // radios de la barra
    const ry = 16;

    const cx = w / 2;                       // centro del notch
    const cy = 0;                           // arriba de la barra
    const r  = NOTCH_R;

    // Rect redondeado (arriba con esquinas) y círculo al centro (resta)
    // Usamos path compuesto y fillRule="evenodd" para “perforar” el círculo.
    const rect =
      `M0,${h} L0,${ry} Q0,0 ${rx},0 L${w - rx},0 Q${w},0 ${w},${ry} ` +
      `L${w},${h} Z`;
    const circle =
      `M${cx - r},${cy} ` +
      `a${r},${r} 0 1,0 ${2 * r},0 ` +
      `a${r},${r} 0 1,0 ${-2 * r},0 Z`;

    return `${rect} ${circle}`;
  }, [barW]);

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <Paper
        d={notchPathD}
        fill={theme.palette.background.paper}
        fillRule="evenodd"
        stroke={theme.palette.divider}
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0 -2px 6px rgba(0,0,0,0.2))' }}
        sx={{
          position: 'fixed',
          left: 0, right: 0, bottom: 0,
          zIndex: (t) => t.zIndex.drawer + 2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          // Importantísimo: el Paper queda transparente y pintamos la forma con SVG
          bgcolor: 'transparent',
          pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <Box ref={barRef} sx={{ position: 'relative', height: BAR_H }}>
          {/* SVG que dibuja la barra con el notch */}
          <svg
            width="100%"
            height={BAR_H}
            viewBox={`0 0 ${Math.max(barW, 320)} ${BAR_H}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, display: 'block' }}
          >
            <path
              d={notchPathD}
              fill={theme.palette.background.paper}
              fillRule="evenodd"
              stroke={theme.palette.divider}
              strokeWidth="1"
            />
          </svg>

          {/* Contenedor FAB y acciones (no altera layout) */}
          <ClickAwayListener onClickAway={close}>
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: BAR_H - MAIN_FAB / 2, // incrustado en el notch
                width: MAIN_FAB,
                height: MAIN_FAB,
                overflow: 'visible',
                zIndex: (t) => t.zIndex.fab + 1,
              }}
            >
              {/* Acciones en abanico */}
              {actions.map((a, i) => {
                const { x, y } = polarToOffset(angles[i]);
                return (
                  <Tooltip key={a.key} title={a.label} placement="top" arrow>
                    <Fab
                      size="small"
                      color="default"
                      onClick={a.onClick}
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: open
                          ? `translate(calc(-50% + ${x}px), calc(-50% - ${y}px)) scale(1)`
                          : 'translate(-50%, -50%) scale(0.8)',
                        opacity: open ? 1 : 0,
                        pointerEvents: open ? 'auto' : 'none',
                        width: ACTION_FAB,
                        height: ACTION_FAB,
                        transition: 'transform .22s ease, opacity .18s ease',
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        boxShadow: 3,
                        '&:hover': { boxShadow: 4, bgcolor: 'grey.50' },
                      }}
                      aria-label={a.label}
                    >
                      {a.icon}
                    </Fab>
                  </Tooltip>
                );
              })}

              {/* FAB central (queda “incrustado” en el notch) */}
              <Fab
                color="primary"
                onClick={() => setOpen((o) => !o)}
                aria-label="Crear"
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: MAIN_FAB,
                  height: MAIN_FAB,
                  boxShadow: 6,
                }}
              >
                <AddIcon
                  sx={{
                    transition: 'transform .2s ease',
                    transform: open ? 'rotate(45deg)' : 'none',
                  }}
                />
              </Fab>
            </Box>
          </ClickAwayListener>

          {/* BottomNavigation sobre la forma con notch */}
          <BottomNavigation
            showLabels
            value={current}
            onChange={(_e, value) => {
              console.log('NAGIVATION', value);
              router.push(value);
            }}
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'transparent',
              height: BAR_H,
              px: 2,
              // Deja “hueco” visual para el FAB, pero aquí el notch ya lo dibuja el SVG
              '& .MuiBottomNavigationAction-root': {
                minWidth: 72,
              },
            }}
          >
            <BottomNavigationAction value="/" label="Inicio" icon={<HomeOutlinedIcon />} />
            {/* Espaciador virtual: empuja acciones hacia los lados */}
            <Box sx={{ flex: 1 }} />
            <BottomNavigationAction value="/profile/me" label="Mi perfil" icon={<PersonOutlineIcon />} />
          </BottomNavigation>
        </Box>
      </Paper>

      {/* Spacer para evitar solape con el contenido */}
      <Box sx={{ height: BAR_H + 28 }} />
    </Box>
  );
}