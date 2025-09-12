import * as React from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField, Stack, Button
} from "@mui/material";
import SpaceCard from "@/components/Spaces/SpaceCard";
import SearchIcon from '@mui/icons-material/Search';
import {withAuth} from '../shared/withAuth';

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

  return (
    <>
      <Head>
        <title>Split Mate</title>
        <meta name="description" content="Split Mate - separa gastos con tus amigos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>

        <Box sx={{ minHeight: 600 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" sx={{ mb: 4 }}>
            <Stack spacing={2}>
              <Box pt={4}>
                <Typography variant="h5">Tus espacios</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: 400 }}
                variant={'outlined'}
                placeholder={'Buscar'}
                label={'Buscar'}
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Stack>
            <Button variant="outlined" color={'primary'}>
                Crear nuevo espacio
            </Button>
          </Stack>
          {
            !mockSpaces?.length && (
              <Box sx={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={'/empty-spaces.svg'} width={'300px'} />
              </Box>
            )
          }
          {
            mockSpaces?.length > 0 && (
              <Grid container spacing={{ xs: 2, md: 4 }}>
                {
                  mockSpaces.map((item, index) => (
                    <Grid item size={{ xs: 12, md: 4 }} key={index}>
                      <SpaceCard item={item} />
                    </Grid>
                  ))
                }
              </Grid>
            )
          }
        </Box>
      </Container>
    </>
  );
}

export const getServerSideProps = withAuth();

export default Home;