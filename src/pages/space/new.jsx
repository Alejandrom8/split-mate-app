import React, {useState} from 'react';
import {Box, Button, Container, Stack, TextField, Typography} from "@mui/material";
import {useRouter} from "next/router";
import {useSnackbar} from "notistack";

/**
 *
 * @returns {Element}
 * @constructor
 *
 *
 * - form with:
 * - event name
 * - event description (optional)
 * - users -
 *  this should be something recursive, you need to specify the username, we can use gravatar to fill the user picture and the user email so we can deliver a password.
 */

export default function CreateSpacePage ({ }) {
  const router = useRouter();
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateSpace = () => {
    setLoading(true);
    try {
      //TODO: integrate create space API
      const space = { id: 1 };
      enqueueSnackbar('Space created successfully', {
        variant: 'success',
      });
      router.push(`/space/${space.id}`);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return <Box sx={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }}>
    <Box
      sx={{ width: { xs: '90vw', sm: '25vw', md: '25vw' }}}
    >
      <Stack direction={'column'} spacing={4}>
        <Box>
          <Typography variant={'h4'}>
            Crea un espacio
          </Typography>
        </Box>
        <Stack direction={'column'} spacing={2}>
          <TextField
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            variant={'outlined'}
            type={'text'}
            name={'spaceName'}
            label={'Nombre'}
            placeholder={'Ingresa el nombre del espacio'}
            disabled={loading}
          />
          <TextField
            value={spaceDescription}
            onChange={(e) => setSpaceDescription(e.target.value)}
            variant={'outlined'}
            type={'text'}
            name={'spaceDescription'}
            label={'Descripción'}
            disabled={loading}
            placeholder={'Ingresa la descripción del espacio'}
          />
        </Stack>
        <Stack direction={'column'} spacing={1}>
          <Button
            fullWidth
            variant={'contained'}
            type={'submit'}
            color={'primary'}
            onClick={handleCreateSpace}
            disabled={loading}
          >
            Crear
          </Button>
          <Button
            fullWidth
            variant={'outlined'}
            type={'submit'}
            color={'secondary'}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        </Stack>
      </Stack>
    </Box>
  </Box>
};