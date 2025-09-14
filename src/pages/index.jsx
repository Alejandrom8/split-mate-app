import * as React from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField, Stack, CircularProgress
} from "@mui/material";
import SpaceCard from "@/components/Spaces/SpaceCard";
import SearchIcon from '@mui/icons-material/Search';
import { withAuth } from '@/shared/withAuth';
import { useState } from "react";
import v1Manager from "@/shared/v1Manager";
import CreateSpeedDial from "@/components/App/CreateSpeedDial";
import {useRouter} from "next/router";

function Home({ initialSpaces }) {
  const [spaces, setSpaces] = useState(initialSpaces?.events);
  const router = useRouter();

  const handleCreated = (_space) => {
    router.push(`/space/${_space.id}`);
  };

  return (
    <>
      <Head>
        <title>Split Mate | Tus espacios</title>
        <meta name="description" content="Split Mate - separa gastos con tus amigos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CreateSpeedDial onSpaceCreated={handleCreated} />
      <Box sx={{ minHeight: 600, pb: 10 }}>
        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', mb: 5, p: 6 }}>
          <Container>
            <Stack
              direction={'column'}
              spacing={2}
              alignItems={'center'}
              justifyContent="space-between"
            >
              <Typography variant="h4">Tus espacios</Typography>
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
            !spaces?.length && (
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