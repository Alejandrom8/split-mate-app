import React from "react";
import Head from "next/head";
import {
  Container,
  Grid,
  Typography,
  Stack,
  Divider
} from "@mui/material";
import SpaceCard from "@/components/Spaces/SpaceCard";
import { withAuth } from '@/shared/withAuth';
import { useState } from "react";
import v1Manager from "@/shared/v1Manager";
import CreateSpeedDial from "@/components/App/CreateSpeedDial";
import { useSnackbar } from "notistack";
import clientManager from "@/shared/clientManager";
import EmptySection from "@/components/App/EmptySection";
import LoadingSection from "@/components/App/LoadingSection";
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

function Home({ initialSpaces }) {
  const [spaces, setSpaces] = useState(initialSpaces?.events);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const result = await clientManager.get(`/space/my-spaces`);
      setSpaces(result.data?.events);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`Hubo un error al traer tus espacios: ${error.message}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = (_space) => {
    //router.push(`/space/${_space.id}`);
    fetchSpaces();
  };

  const handleSpaceDeletion = (item) => {
    const prevSpaces = spaces.slice();
    const deletedItemIndex = spaces.find(s => s.id === item.id);
    if (deletedItemIndex === -1) return;
    prevSpaces.splice(deletedItemIndex, 1);
    setSpaces(prevSpaces);
  };

  return (
    <>
      <Head>
        <title>Divi | Tus espacios</title>
        <meta name="description" content="Split Mate - separa gastos con tus amigos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={`Split Mate`} />
        <meta property="og:description" content="Split Mate - separa gastos con tus amigos" />
        <meta property="og:image" content="https://split-mate-app.vercel.app/favicon.ico" />
        <meta property="og:url" content="https://split-mate-app.vercel.app/" />
        <meta property="og:type" content="website" />
      </Head>

      {/** Speed Dial */}
      <CreateSpeedDial onSpaceCreated={handleCreated} />

      {/* Main */}
      <Container sx={{ mt: 5, mb: 10, minHeight: '91vh' }}>
        {
          loading && <LoadingSection />
        }
        {
          !spaces?.length && !loading && <EmptySection />
        }
        {
          spaces?.length > 0 && !loading && <>
            <Stack direction={'column'} spacing={2}>
              <Stack direction={'column'} py={1} spacing={1}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <PersonIcon sx={{ color: '#bbb' }} fontSize="small" />
                  <Typography variant="subtitle1" color='#bbb' sx={{ fontWeight: 0 }}>
                    Tus espacios
                  </Typography>
                </Stack>
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ pt: 1 }}>
                  {
                    spaces.filter(s => s?.member_role === 'owner').map((item, index) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <SpaceCard
                          item={item}
                          onDelete={handleSpaceDeletion}
                        />
                      </Grid>
                    ))
                  }
                </Grid>
              </Stack>
              <Stack direction={'column'} py={1} spacing={1}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <PeopleIcon sx={{ color: '#bbb' }} fontSize="small" />
                  <Typography variant="subtitle1" color='#bbb' sx={{ fontWeight: 0 }}>
                    Otros espacios
                  </Typography>
                </Stack>
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ pt: 1 }}>
                  {
                    spaces.filter(s => s?.member_role !== 'owner').map((item, index) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <SpaceCard
                          item={item}
                          onDelete={handleSpaceDeletion}
                        />
                      </Grid>
                    ))
                  }
                </Grid>
              </Stack>
            </Stack>
          </>
        }
      </Container>
    </>
  );
}

export const getServerSideProps = withAuth(async ({ authHeader }) => {
  try {
    const result = await v1Manager.get(`/v1/events/my-events`, {}, authHeader);
    return {
      props: {
        initialSpaces: result.data?.data,
      }
    };
  } catch (error) {
    console.log(error);
    return {};
  }
});

export default Home;