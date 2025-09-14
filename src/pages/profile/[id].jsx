// pages/profile.js
import { useAuth } from '../../context/AuthContext';
import { Avatar, Box, Typography, Stack, Paper, Breadcrumbs, Link } from '@mui/material';
import {withAuth} from "@/shared/withAuth";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NextLink from "next/link";

function ProfilePage() {
  const { user } = useAuth();

  return <>
    <Breadcrumbs sx={{ py: 2 }} separator={<NavigateNextIcon fontSize="small" />}>
      <Link color="primary" href="/" component={NextLink} sx={{ display: 'flex', alignItems: 'center' }}>
        <HomeIcon fontSize={'small'} sx={{ mr: 1 }}/>
        Inicio
      </Link>
      <Typography key="3" sx={{ color: 'text.primary' }}>
        Perfil
      </Typography>
    </Breadcrumbs>
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
      bgcolor="background.default"
      px={2}
    >
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 96, height: 96 }}>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h6">{user.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  </>;
}

export const getServerSideProps = withAuth();

export default ProfilePage;