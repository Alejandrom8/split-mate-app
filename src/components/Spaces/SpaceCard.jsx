import React, {useMemo} from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardContent, IconButton, MenuItem,
  Stack,
  Typography,
  Menu, ListItemIcon,
} from "@mui/material";
import {useRouter} from "next/router";
import TodayIcon from '@mui/icons-material/Today';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';

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
          <Typography variant={'h5'} sx={{ flexGrow: 1 }} onClick={handleClick}>
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
                    width: '15ch',
                  },
                },
                list: {
                  'aria-labelledby': 'long-button',
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <DeleteIcon fontSize={'small'} />
                </ListItemIcon>
                Borrar
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
                  item?.members?.map((user, index) => (
                    <Avatar
                      key={index}
                      src={user?.profile_image_url}
                      alt={user?.username}
                      sx={{ width: 36, height: 36 }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  ))
                }
              </AvatarGroup>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
  </Card>
};