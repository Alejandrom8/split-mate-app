// pages/profile.js
import { useAuth } from '../../context/AuthContext';
import { Avatar, Box, Typography, Stack, Paper } from '@mui/material';
import {withAuth} from "@/shared/withAuth";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
      bgcolor="background.default"
      px={2}
    >
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 96, height: 96 }}>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h6">{user.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export const getServerSideProps = withAuth();

export default ProfilePage;