import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,
  Button,
  styled,
  Stack,
  Tooltip
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Home from "@mui/icons-material/Home";
import Person from "@mui/icons-material/Person";
import AppTitle from "@/components/App/AppTitle";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchInput from "../Form/SearchInput";

const CircleButton = styled(IconButton)(({ theme }) => ({
  width: 38,
  height: 38,
  borderRadius: 999,
  padding: 0,
  backgroundColor: 'rgba(0,0,0,0.03)',
  "&:hover": {
    filter: "brightness(2.05)",
  },
  "&:focus-visible": {
    outlineOffset: 2,
  },
}));

export default function SplitMateAppBar({ onSettings = () => {} }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const router = useRouter();
  const shouldShowAppVar = ['/login', '/logout', '/about'].find(path => path === router.pathname) === undefined && user;

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  if (!shouldShowAppVar) return <></>;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          backdropFilter: "blur(12px)",
          bgcolor: "rgba(255,255,255,0.2)",
          color: "text.primary",
          borderRadius: 0,
          margin: 0,
          padding: 0,
          zIndex: 10,
        }}
      >
        <Toolbar disableGutters sx={{ px: { xs: 2, md: 20 }, py: 1, gap: 2, display: 'flex', alignItems: 'center' }}>
          {/* Logo/Marca */}
          <AppTitle href="/home" />

          {/* Empuja a la derecha el avatar */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Avatar + menú */}
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Tooltip title='Tu perfil'>
              <IconButton
                onClick={() => router.push('/profile/me')}
                size='small'
              >
                <Avatar
                  src={user?.profile_image_url}
                  alt={user?.name}
                  sx={{ width: 36, height: 36 }}
                >
                  {user?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Tooltip title='Menú'>
              <CircleButton
                onClick={handleOpenMenu}
                aria-label="Abrir menú"
                aria-controls={open ? "splitmate-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                size="medium"
              >
                <MenuRoundedIcon fontSize="small"/>
              </CircleButton>
            </Tooltip>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            id="user-menu"
            open={open}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5, minWidth: 200, overflow: "visible",
                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 8px 24px 0px',
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transitionDuration={0}
          >
            <MenuItem onClick={() => router.push(`/home`)}>
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              Inicio
            </MenuItem>
            <MenuItem onClick={onSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configuración
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => router.push("/logout")}>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Espaciador */}
      <Toolbar />
    </>
  );
}