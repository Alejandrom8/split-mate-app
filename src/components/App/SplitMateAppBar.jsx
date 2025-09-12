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
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import AppTitle from "@/components/App/AppTitle";
import {useRouter} from "next/router";

export default function SplitMateAppBar({
                                          user = { name: "Usuario", avatarUrl: "" },
                                          onProfile = () => {},
                                          onSettings = () => {},
                                          onLogout = () => {},
                                        }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

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
          bgcolor: "rgba(255,255,255,0.9)", // ajusta para modo oscuro si quieres
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
          borderRadius: 0,
          margin: 0,
        }}
      >
        {/* Toolbar sin padding lateral */}
        <Toolbar disableGutters sx={{ px: 2, gap: 1 }}>
          {/* Logo/Marca */}
          <AppTitle />

          <Typography>
            {user.name}
          </Typography>

          {/* Avatar + menú */}
          <IconButton
            onClick={handleOpenMenu}
            size="small"
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              sx={{ width: 36, height: 36 }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
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
            <MenuItem onClick={onProfile}>
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
            <MenuItem onClick={onLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Espaciador para que el contenido no quede debajo */}
      <Toolbar />
    </>
  );
}