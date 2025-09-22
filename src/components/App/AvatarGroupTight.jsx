// Avatares compactos
import {Avatar, Stack} from "@mui/material";


const AvatarSizes = {
  small: {
    width: 28,
    height: 28
  },
  medium: {
    width: 34,
    height: 34
  }
};

export default function AvatarGroupTight({ members, size = 'small' }) {
  const dimensions = AvatarSizes[size];

  return (
    <Stack direction="row" spacing={-0.5}>
      {members.slice(0, 5).map((m) => (
        <Avatar
          key={m.id}
          src={m?.profile_image_url}
          alt={m?.username}
          sx={{ ...dimensions, border: "2px solid #fff" }}
        />
      ))}
      {members.length > 5 && (
        <Avatar
          sx={{ ...dimensions, bgcolor: "grey.300", color: "text.primary", fontSize: 12 }}
        >
          +{members.length - 5}
        </Avatar>
      )}
    </Stack>
  );
}