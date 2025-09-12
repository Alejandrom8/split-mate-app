import React, {useMemo} from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent, IconButton, MenuItem,
  Stack,
  Typography,
  Menu,
} from "@mui/material";
import {useRouter} from "next/router";
import TodayIcon from '@mui/icons-material/Today';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


export default function SpaceCard({ item }) {
  const router = useRouter();
  const date = useMemo(() => new Date(item.event_date).toDateString(), []);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    router.push(`/space/${item.id}`);
  };

  return <Card
    sx={{
      cursor: "pointer",
    }}
  >
      <CardContent>
        <Stack direction={'row'} justifyContent={'space-between'} sx={{ width: '100%', mb: 1 }} spacing={1} alignItems={'center'}>
          <Typography variant={'h5'}>
            {item.name}
          </Typography>
          <Stack direction={'row'}>
            <IconButton size={'small'} onClick={handleMenuClick}>
              <MoreHorizIcon fontSize={'small'} />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '10ch',
                  },
                },
                list: {
                  'aria-labelledby': 'long-button',
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                Hola
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Stack spacing={2} onClick={handleClick}>
          <Box>
            <Stack direction={'row'} alignItems={'center'} sx={{ mb: 1 }} spacing={1}>
              <TodayIcon fontSize={'small'} color={'secondary'} />
              <Typography variant={'caption'} color={'textSecondary'}>
                {date}
              </Typography>
            </Stack>
            <Typography color={'textSecondary'}>
              {item.description}
            </Typography>
          </Box>
          <Box>
            <Stack direction={'row'} spacing={2}>
              <AvatarGroup>
                {
                  [
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
                  ].map((user, index) => (
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
  </Card>
};