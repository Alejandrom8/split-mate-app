import React, {useMemo, useState} from 'react';
import {Box, Button, CircularProgress, Collapse, Stack, TextField, Typography} from "@mui/material";
import AppTitle from "@/components/App/AppTitle";
import {useRouter} from "next/router";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PasswordTextField from "@/components/Form/PasswordTextField";
import UsernameTextField from "@/components/Form/UsernameTextField";
import {useSnackbar} from "notistack";
import {useAuth} from "@/context/AuthContext";
import Head from "next/head";

const passwordRules = [
  { id: '1', label: 'Mínimo 8 caracteres', test: (v) => v.length >= 8 },
  { id: '2', label: 'Al menos una mayúscula', test: (v) => /[A-Z]/.test(v) },
  { id: '3', label: 'Al menos un número', test: (v) => /\d/.test(v) },
  { id: '4', label: 'Al menos un caracter especial (!@#$%^&*_)', test: (v) => /[!@#$%^&*_]/.test(v) },
];

function SignInPage({ initialMode = 'login', next }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isLogin = useMemo(() => mode === 'login', [mode]);
  const isSignUp = useMemo(() => mode === 'signup', [mode]);
  const { login, signup } = useAuth();

  const setModeAsLogin = () => setMode('login');
  const setModeAsSignUp = () => setMode('signup');

  const handleValidUsername = (uname) => {
    setUsername(uname);
  };

  const handleValid = (pwd) => {
    setPassword(pwd);
  };

  const handleValidRepeated = (pwd) => {
    setRepeatedPassword(pwd);
  };

  const handleLoginSubmit = async () => {
    setLoading(true);
    try {
      await login({ username, password });
      enqueueSnackbar('Inicio de sesión exitoso', { variant: 'success' });
      setLoading(false);
      await router.push(next ? next : '/');
    } catch (error) {
      enqueueSnackbar('Error al iniciar sesión: ' + (error.response?.data?.message || error.message), {
        variant: 'error',
      });
      setLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    setLoading(true);
    try {
      await signup({ username, email, password });
      enqueueSnackbar('Cuenta creada con éxito', { variant: 'success' });
      setLoading(false);
      await router.push(next ? next : '/');
    } catch (error) {
      enqueueSnackbar('Error al crear la cuenta: ' + (error.response?.data?.message || error.message), {
        variant: 'error'
      });
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
      if (isLogin) {
        await handleLoginSubmit();
      } else if (isSignUp) {
        await handleSignupSubmit();
      }
  };

  return <>
    <Head>
        <title>Split Mate | { isLogin ? 'Iniciar sesión' : 'Crear cuenta' }</title>
    </Head>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      minHeight: '100vh',
      height: 'fit-content',
      paddingTop: '100px',
      paddingBottom: '100px',
    }}>
      <Box
        component={'form'}
        onSubmit={handleFormSubmit}
        sx={{
          width: 400,
          border: {
            xs: 'none',
            md: '1px solid #ccc'
          },
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', mb: 4, width: '100%' }}>
          <AppTitle />
        </Box>
        <Box sx={{ display: 'flex', mb: 1, width: '100%' }}>
          <Typography variant={'h6'}>
            { mode === 'login' ? 'Inicia sesión' : 'Crea una cuenta' }
          </Typography>
        </Box>
        <Stack direction={'column'} spacing={3} alignItems={'center'} justifyContent={'center'}>
          <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
            <UsernameTextField
              disabled={loading}
              onValidUsername={handleValidUsername}
            />
            <Collapse in={isSignUp} unmountOnExit>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type={'email'}
                placeholder={'Correo electrónico'}
                fullWidth
                hiddenLabel
                variant={'outlined'}
                disabled={loading}
                InputProps={{
                  startAdornment: <AlternateEmailIcon sx={{ mr: 2 }} />
                }}
              />
            </Collapse>
            <PasswordTextField
              disabled={loading}
              placeholder="Contraseña"
              rules={isSignUp ? passwordRules : undefined}
              instructionsTitle={isSignUp ? "Tu contraseña debe incluir:" : undefined}
              onValidPassword={handleValid}
            />
            <Collapse in={mode === 'signup'} unmountOnExit>
              <PasswordTextField
                disabled={loading}
                placeholder="Repite tu contraseña"
                rules={isSignUp ? [{
                  id: '1',
                  label: 'Tus contraseñas deben coincidir',
                  test: (v) => v && v === password,
                }] : undefined}
                instructionsTitle={isSignUp ? "Tu contraseña debe incluir:" : undefined}
                onValidPassword={handleValidRepeated}
              />
            </Collapse>
          </Stack>
          <Collapse in={isLogin} sx={{ width: '100%' }} unmountOnExit>
            <Stack direction={'column'} spacing={1} sx={{ width: '100%' }}>
              <Button
                type={'submit'}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading} // opcional: bloquea el botón mientras carga
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
              <Button fullWidth onClick={setModeAsSignUp}>
                ¿No tienes una cuenta?
              </Button>
            </Stack>
          </Collapse>
          <Collapse in={isSignUp} sx={{ width: '100%' }} unmountOnExit>
            <Stack direction={'column'} spacing={1} sx={{ width: '100%' }}>
              <Button
                type={'submit'}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading} // opcional, evita doble clic
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Crear cuenta'
                )}
              </Button>
              <Button fullWidth onClick={setModeAsLogin}>
                ¿Ya tienes una cuenta?
              </Button>
            </Stack>
          </Collapse>
        </Stack>
      </Box>
    </Box>
  </>;
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  let props = {};
  if (query.mode === 'signup' || query.mode === 'login') {
    props = {
      ...props,
      initialMode: query.mode,
    };
  }
  if (query?.next) {
    props.next = query.next;
  }
  return {
    props,
  };
}

export default SignInPage;