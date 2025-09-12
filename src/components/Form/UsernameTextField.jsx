import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function UsernameTextField({ placeholder = 'Nombre de usuario', onValidUsername, ...props }) {
  const [value, setValue] = React.useState('');

  const hasText = value.length > 0;
  const isValid = /^[a-zA-Z0-9._]{3,20}$/.test(value);
  const isInvalid = hasText && !isValid;

  React.useEffect(() => {
    if (isValid && onValidUsername) {
      onValidUsername(value);
    }
  }, [isValid, value, onValidUsername]);

  return (
    <TextField
      {...props}
      type="text"
      placeholder={placeholder}
      fullWidth
      hiddenLabel
      variant="outlined"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={isInvalid}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircleIcon sx={{ mr: 1 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          ...(isValid && hasText
            ? {
              '& fieldset': { borderColor: 'success.main' },
              '&:hover fieldset': { borderColor: 'success.dark' },
              '&.Mui-focused fieldset': { borderColor: 'success.dark' },
            }
            : {}),
          ...(isInvalid
            ? {
              '& fieldset': { borderColor: 'error.main' },
              '&:hover fieldset': { borderColor: 'error.dark' },
              '&.Mui-focused fieldset': { borderColor: 'error.dark' },
            }
            : {}),
        },
      }}
    />
  );
}