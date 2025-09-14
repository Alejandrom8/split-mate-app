import React, { useCallback, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField, Stack,
  CircularProgress,
  IconButton
} from "@mui/material";
import SpaceCard from "@/components/Spaces/SpaceCard";
import SearchIcon from '@mui/icons-material/Search';
import { withAuth } from '@/shared/withAuth';
import { useState } from "react";
import v1Manager from "@/shared/v1Manager";
import CreateSpeedDial from "@/components/App/CreateSpeedDial";
import {useRouter} from "next/router";
import useDelayedQuery from "@/hooks/useDelayedQuery";
import { useSnackbar } from "notistack";
import clientManager from "@/shared/clientManager";
import CancelIcon from '@mui/icons-material/Cancel';
import EmptySection from "@/components/App/EmptySection";

function Home({ initialSpaces }) {
  const [spaces, setSpaces] = useState(initialSpaces?.events);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [query, setQuery] = useState('');
  const delayedQuery = useDelayedQuery(query, 700);


  const fetchSpaces = useCallback(async (q) => {
    setLoading(true);
    try {
      const _query = typeof q === 'string' ? q : query;
      const result = await clientManager.get(`/space/my-spaces${_query && _query.trim() !== '' ? `?search=${_query}` : ''}`);
      setSpaces(result.data?.events);
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Hubo un error al traer tus espacios', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleCreated = (_space) => {
    router.push(`/space/${_space.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchSpaces()
        .catch(error => {
          console.log('FETCH SPACES ERROR', error);
        })
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    fetchSpaces('')
      .catch(error => {
        console.log('FETCH SPACES ERROR', error);
      })
  };

  // useEffect(() => {
  //   if (delayedQuery === '') return;

  // }, [delayedQuery]);

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
                sx={{ width: { xs: '80vw', sm: '60vw', md: '40vw' }, borderRadius: 10 }}
                variant={'outlined'}
                value={query}
                onKeyDown={handleKeyDown}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={'Buscar por nombre de espacio o persona'}
                InputProps={{
                  endAdornment: query?.length > 0 
                  ? <IconButton onClick={handleClearSearch} size="small">
                    <CancelIcon fontSize="small"/>
                  </IconButton>
                  : <IconButton onClick={fetchSpaces} size='small'>
                    <SearchIcon fontSize="small" />
                  </IconButton>,
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
            !spaces?.length && !loading && <EmptySection />
          }
          {
            spaces?.length > 0 && !loading && (
              <Grid container spacing={{ xs: 2, md: 4 }}>
                {
                  spaces.map((item, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index}>
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