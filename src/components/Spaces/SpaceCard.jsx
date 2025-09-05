import React, {useMemo} from 'react';
import {Avatar, AvatarGroup, Box, Card, CardActionArea, CardContent, Stack, Typography} from "@mui/material";
import {useRouter} from "next/router";

export default function SpaceCard({ item }) {
  const router = useRouter();
  const date = useMemo(() => new Date(item.createdAt).toDateString(), []);

  const handleClick = () => {
    router.push(`/space/${item.id}`);
  };

  return  <Card onClick={handleClick}>
    <CardActionArea>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant={'caption'}>
              {date}
            </Typography>
            <Typography variant={'h5'}>
              {item.name}
            </Typography>
            <Typography>
              {item.description}
            </Typography>
          </Box>
          <Box>
            <Stack direction={'row'} spacing={2}>
              <AvatarGroup>
                {
                  item.users.map((user, index) => (
                    <Avatar
                      key={index}
                      src={user.picture}
                    />
                  ))
                }
              </AvatarGroup>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
};