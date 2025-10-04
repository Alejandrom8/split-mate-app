import { useAuth } from '@/context/AuthContext';
import {
  Avatar, Box, Typography, Stack, Paper, 
  Breadcrumbs, Link, Container, TextField,
  Button,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
import {withAuth} from "@/shared/withAuth";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NextLink from "next/link";
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import clientManager from '@/shared/clientManager';
import ProfileAvatarEditor from '@/components/Form/ProfileAvatarEditor';
import { useRouter } from 'next/router';
import Head from "next/head";


function ProfilePage({ authHeader }) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await clientManager.put('/users/profile', {
        first_name: firstName,
        last_name: lastName,
        email,
        bank_name: bankName,
        account_number: bankAccount,
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
    setBankAccount(user?.account_number);
    setBankName(user?.bank_name);
  }, [user]);

  return <>
    <Head>
      <title>Divi | Tu perfil</title>
      <meta name="description" content="Split Mate - separa gastos con tus amigos" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:title" content={`Split Mate`} />
      <meta property="og:description" content="Split Mate - separa gastos con tus amigos" />
      <meta property="og:image" content="https://split-mate-app.vercel.app/favicon.ico" />
      <meta property="og:url" content="https://split-mate-app.vercel.app/" />
      <meta property="og:type" content="website" />
    </Head>
    <Container sx={{ py: 3, height: '100vh' }}>
      <Box
        px={2}
        sx={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ p: 4, borderRadius: 2, width: { xs: '100%', md: '50%' } }}>
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
            <Box sx={{ width: '100%', pb: 2 }}>
              <Typography textAlign={'left'} variant='subtitle2' color='gray'>
                Información personal
              </Typography>
            </Box>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type={'email'}
              placeholder={'Correo electrónico'}
              label={'Correo electrónico'}
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
              label={'Nombre'}
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
              label={'Apellido'}
              fullWidth
              hiddenLabel
              variant={'outlined'}
              disabled={loading}
            />
            <Box sx={{ width: '100%', py: 1 }}>
              <Typography textAlign={'left'} variant='subtitle2' color='gray'>
                Información bancaria
              </Typography>
            </Box>
            <TextField
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              type={'text'}
              placeholder={'Nombre del banco'}
              label={'Nombre del banco'}
              fullWidth
              hiddenLabel
              variant={'outlined'}
              disabled={loading}
            />
            <TextField
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              type={'number'}
              placeholder={'No. de cuenta bancaria'}
              label={'No. de cuenta bancaria'}
              fullWidth
              hiddenLabel
              variant={'outlined'}
              disabled={loading}
              sx={{
                "& input[type=number]": {
                  MozAppearance: "textfield" // Firefox
                },
                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0
                }
              }}
            />
          </Stack>
          <Stack direction={'column'} spacing={1} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              onClick={handleUpdateProfile}
            >
              {
                loading 
                  ? <CircularProgress size="1.5rem" />
                  : 'Guardar'
              }
            </Button>
            <Button 
              variant="outlined"
              color="primary"
              disabled={loading}
              fullWidth
              onClick={() => router.push('/home')}
            >
              Cancelar
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  </>;
}

export const getServerSideProps = withAuth(async ({ authHeader }) => {
  return {
    props: {
      authHeader
    }
  }
});

export default ProfilePage;