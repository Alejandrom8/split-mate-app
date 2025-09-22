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
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import AppTitle from "@/components/App/AppTitle";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function SplitMateAppBar({ onSettings = () => {} }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const router = useRouter();
  const shouldShowAppVar = ['/login', '/logout', '/space/[id]/ticket/[ticket_id]', '/about'].find(path => path === router.pathname) === undefined && user;

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
          bgcolor: "rgba(255,255,255,0.9)",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
          borderRadius: 0,
          margin: 0,
          zIndex: 10,
        }}
      >
        <Toolbar disableGutters sx={{ px: 2, gap: 2 }}>
          {/* Logo/Marca */}
          <AppTitle />

          {/* Empuja a la derecha el avatar */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Nombre de usuario */}
          {user && (
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              @{user?.username}
            </Typography>
          )}

          {/* Avatar + menú */}
          <IconButton
            onClick={handleOpenMenu}
            size="small"
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={user?.profile_image_url}
              alt={user?.name}
              sx={{ width: 36, height: 36 }}
            >
              {user?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="user-menu"
            open={open}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 200, overflow: "visible" },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => router.push(`/profile/me`)}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={onSettings}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configuración
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => router.push("/logout")}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
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