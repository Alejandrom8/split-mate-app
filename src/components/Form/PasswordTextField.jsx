// PasswordTextField.jsx
import React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyIcon from '@mui/icons-material/Key';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PropTypes from 'prop-types';

export default function PasswordTextField({
                                            placeholder = 'Contraseña',
                                            rules = [],
                                            onValidPassword,
                                            instructionsTitle,
                                            disabled,
                                            name = 'password',
                                            defaultValue = '',
                                            ...props
                                          }) {
  const [value, setValue] = React.useState(defaultValue);
  const [show, setShow] = React.useState(false);
  const hasText = value.length > 0;

  const results = React.useMemo(
    () => rules.map((r) => (typeof r.test === 'function' ? r.test(value) : false)),
    [rules, value]
  );

  const allValid = React.useMemo(() => {
    if (!hasText) return false;
    if (rules.length === 0) return true;
    return results.every(Boolean);
  }, [hasText, results, rules.length]);

  const isInvalid = React.useMemo(() => {
    if (!hasText) return false;
    if (rules.length === 0) return false;
    return !allValid;
  }, [hasText, rules.length, allValid]);

  // Reporta solo cuando es válida y evita disparos repetidos con el mismo valor.
  const lastReported = React.useRef(null);
  React.useEffect(() => {
    if (allValid && onValidPassword && value !== lastReported.current) {
      lastReported.current = value;
      onValidPassword(value);
    }
    if (!allValid) {
      lastReported.current = null;
    }
  }, [allValid, onValidPassword, value]);

  return (
    <Stack spacing={1.5} sx={{ width: '100%', margin: 0 }}>
      <TextField
        {...props}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        fullWidth
        variant="outlined"
        name={name}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={isInvalid}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <KeyIcon sx={{ mr: 1 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShow((s) => !s)}
                edge="end"
              >
                {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            ...(allValid && hasText
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

      {/* Checklist opcional */}
      {value && rules.length > 0 && (
        <Stack spacing={0.5}>
          {instructionsTitle && (
            <Typography variant="caption" color="text.secondary">
              {instructionsTitle}
            </Typography>
          )}
          <List dense disablePadding>
            {rules.map((rule, idx) => {
              const ok = results[idx];
              return (
                <ListItem key={rule.id ?? `${idx}-${rule.label}`} sx={{ py: 0.25 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    {ok ? (
                      <CheckCircleOutlineIcon fontSize="small" color="success" />
                    ) : (
                      <CancelOutlinedIcon fontSize="small" color={hasText ? 'error' : 'disabled'} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ variant: 'caption' }}
                    primary={rule.label}
                  />
                </ListItem>
              );
            })}
          </List>
        </Stack>
      )}
    </Stack>
  );
}

PasswordTextField.propTypes = {
  placeholder: PropTypes.string,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      test: PropTypes.func.isRequired,
      id: PropTypes.string,
    })
  ),
  onValidPassword: PropTypes.func,
  instructionsTitle: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
};