/**
 * Componente tipo selector para espacios.
 * Realiza búsquedas por texto mediante el parámetro search al endpoint /space/my-spaces?search=
 * Reporta por medio de la función onChange el espacio seleccionado.
 * */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import clientManager from "@/shared/clientManager";

const SpaceSelector = ({ value, onChange, label, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const search = async () => {
    setLoading(true);
    try {
      const result = await clientManager.get(`/space/my-spaces${inputValue && inputValue.trim() !== '' ? `?search=${inputValue}` : ''}`);
      setOptions(result.data?.events);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) return;
    search().catch(error => console.error(`SPACE SEARCH ERROR`, error));
  }, [loading, inputValue]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name || ''}
      options={options}
      loading={loading}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
        setLoading(true);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

SpaceSelector.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

SpaceSelector.defaultProps = {
  value: null,
  label: 'Select Space',
  placeholder: 'Search spaces...',
};

export default SpaceSelector;