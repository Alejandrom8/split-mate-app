import { useAuth } from '@/context/AuthContext';
import {
  Avatar, Box, Typography, Stack, Paper, 
  Breadcrumbs, Link, Container, TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import {withAuth} from "@/shared/withAuth";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NextLink from "next/link";
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import clientManager from '@/shared/clientManager';
import ProfileAvatarEditor from '@/components/Form/ProfileAvatarEditor';


function ProfilePage({ authHeader }) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [email, setEmail] = useState(user?.email);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await clientManager.put('/users/profile', {
        first_name: firstName,
        last_name: lastName,
        email,
      });
      console.log("Profile update response", res);
      enqueueSnackbar(res.message, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFirstName(user?.first_name);
    setLastName(user?.last_name);
    setEmail(user?.email);
  }, [user]);

  return <Container sx={{ py: 3, height: '90vh' }}>
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
      px={2}
      sx={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: { xs: '100%', md: '50%' } }}>
        <Stack spacing={2} alignItems="center">
          <ProfileAvatarEditor
            user={user}
            authHeader={authHeader}
            initialSrc={user?.profile_image_url}
            onUploaded={(url) => {
              // Actualiza tu estado global/perfil si lo necesitas
              console.log('Imagen subida en:', url);
            }}
          />
          <Typography variant="h6">
            @{user?.username}
          </Typography>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type={'email'}
            placeholder={'Correo electrónico'}
            fullWidth
            hiddenLabel
            variant={'outlined'}
            disabled={loading}
          />
          <TextField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type={'text'}
            placeholder={'Nombre'}
            fullWidth
            hiddenLabel
            variant={'outlined'}
            disabled={loading}
          />
          <TextField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type={'text'}
            placeholder={'Apellido'}
            fullWidth
            hiddenLabel
            variant={'outlined'}
            disabled={loading}
          />
          <Button 
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            onClick={handleUpdateProfile}
          >
            {
              loading 
                ? <CircularProgress fontSize='small' />
                : 'Guardar'
            }
          </Button>
        </Stack>
      </Paper>
    </Box>
  </Container>;
}

export const getServerSideProps = withAuth(async ({ authHeader }) => {
  return {
    props: {
      authHeader
    }
  }
});

export default ProfilePage;