import * as React from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField, Stack, Button, CircularProgress
} from "@mui/material";
import SpaceCard from "@/components/Spaces/SpaceCard";
import SearchIcon from '@mui/icons-material/Search';
import {withAuth} from '../shared/withAuth';
import CreateSpaceModal from "@/components/Spaces/CreateSpaceModal";
import CreateSpaceSpeedDial from "@/components/Spaces/CreateSpaceDial";
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import clientManager from "@/shared/clientManager";

const mockSpaces = [
  {
    id: '21',
    createdAt: '2019-03-01T00:00:00.000Z',
    name: 'Viaje a Oaxaca',
    description: 'Viaje de despedida de Lis y Uri a Oaxaca',
    users: [
      {
        username: 'alex',
        picture: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        username: 'Uri',
        picture: 'https://i.pravatar.cc/400?img=68'
      },
      {
        username: 'Maggy',
        picture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop'
      },
    ]
  },
  {
    id: '22',
    name: 'Viaje a Acapulco',
    createdAt: '2019-03-01T00:00:00.000Z',
    description: 'Viaje random a acapulco',
    users: [
      {
        username: 'alex',
        picture: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        username: 'Uri',
        picture: 'https://i.pravatar.cc/400?img=68'
      },
      {
        username: 'Maggy',
        picture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop'
      },
    ]
  }
];


function Home() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [spaces, setSpaces] = useState(null);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const result = await clientManager.get('/space/my-spaces');
      setSpaces(result.data?.events);
    } catch (error) {
      enqueueSnackbar('Hubo un error al traer tus espacios', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = (space) => {
    // ejemplo: redirigir, refrescar lista, snackbar, etc.
    console.log('Space creado:', space);
    fetchSpaces().catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSpaces().catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Head>
        <title>Split Mate</title>
        <meta name="description" content="Split Mate - separa gastos con tus amigos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <Box sx={{ minHeight: 600 }}>
          <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', mb: 5, p: 6 }}>
            <Container>
              <Stack direction={'column'} spacing={2} alignItems={'center'} justifyContent="space-between">
                <Stack spacing={2} direction={'row'} justifyContent={'space-evenly'} alignItems={'center'} sx={{ width: '100%' }}>
                  <Box>
                    <Typography variant="h4">Tus espacios</Typography>
                  </Box>
                </Stack>
                <TextField
                  size="small"
                  sx={{ width: { xs: '80vw', sm: '40vw' }, borderRadius: 10 }}
                  variant={'outlined'}
                  placeholder={'Buscar por nombre de espacio o persona'}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                />
              </Stack>
            </Container>
          </Box>
          <Container>
            {
              loading && <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            }
            {
              !spaces?.length && !loading && (
                <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={'/empty-spaces.svg'} width={'300px'} />
                </Box>
              )
            }
            {
              spaces?.length > 0 && (
                <Grid container spacing={{ xs: 2, md: 4 }}>
                  {
                    spaces.map((item, index) => (
                      <Grid item size={{ xs: 12, md: 4 }} key={index}>
                        <SpaceCard item={item} />
                      </Grid>
                    ))
                  }
                </Grid>
              )
            }
          </Container>
        </Box>
        <CreateSpaceSpeedDial onCreate={() => setOpen(true)} />
        <CreateSpaceModal
          open={open}
          onClose={() => setOpen(false)}
          onCreated={handleCreated}
        />
    </>
  );
}

export const getServerSideProps = withAuth();

export default Home;