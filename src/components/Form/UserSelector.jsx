import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Avatar,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import clientManager from '@/shared/clientManager';
import { fullName } from '@/shared/utils';

export default function UserSelector({
  value = [],
  onChange,
  label = 'Usuarios',
  placeholder = 'Buscar usuarios…',
  debounceMs = 300,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const query = inputValue.trim();

  useEffect(() => {
    if (!open) return; // no busques si está cerrado
    let active = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `/users/search${query ? `?search=${encodeURIComponent(query)}` : ''}`;
        const result = await clientManager.get(url);
        if (!active) return;
        setOptions(Array.isArray(result.data?.users) ? result.data.users : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (active) setOptions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [open, query, debounceMs]);

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  return (
    <Autocomplete
      multiple
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      loading={loading}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={(option) => fullName(option) || ''}
      noOptionsText={query ? 'Sin resultados' : 'Escribe para buscar'}
      filterSelectedOptions
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              src={option.profile_image_url || undefined}
              alt={fullName(option)}
              sx={{ width: 28, height: 28, fontSize: 12 }}
            >
              {(fullName(option) || '?').slice(0, 1).toUpperCase()}
            </Avatar>
            <Typography variant="body2" fontWeight={700} noWrap>
              {fullName(option)}
            </Typography>
          </Stack>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}