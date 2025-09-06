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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


export default function SpaceCard({ item }) {
  const router = useRouter();
  const date = useMemo(() => new Date(item.createdAt).toDateString(), []);
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
        <Stack direction={'row'} justifyContent={'space-between'} sx={{ width: '100%' }} spacing={1} alignItems={'center'}>
          <Typography variant={'caption'}>
            {date}
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
  </Card>
};