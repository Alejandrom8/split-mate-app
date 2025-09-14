'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Stack, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

export default function TicketDropzone({
                                          onFiles,
                                          maxFiles = 10,
                                          accept = { 'image/*': [], 'application/pdf': [] },
                                          disabled = false,
                                        }) {
  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (onFiles) {
        onFiles(acceptedFiles, fileRejections);
      }
    },
    [onFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  });

  return (
    <Box
      {...getRootProps()}
      role="button"
      aria-label="Sube tu ticket"
      sx={{
        width: '100%',
        p: 4,
        borderRadius: 1,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: '2px dashed',
        borderColor: isDragReject
          ? 'error.main'
          : isFocused || isDragActive
            ? 'primary.main'
            : 'primary.main',
        bgcolor: isDragActive ? 'grey.50' : 'transparent',
        color: 'text.secondary',
        transition: 'border-color .2s ease, background-color .2s ease',
        outline: 'none',
      }}
    >
      <input {...getInputProps()} />
      <Stack spacing={1} alignItems="center">
        <CloudUploadOutlinedIcon fontSize="large" />
        <Typography variant="body1" color="text.secondary">
          Sube tus tickets
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Arrastra y suelta o haz clic
        </Typography>
      </Stack>
    </Box>
  );
}