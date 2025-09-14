import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardMedia, Typography, IconButton, Stack, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileCard({ file, onDelete }) {
  const isImage = file.type?.startsWith("image/");
  const [objectUrl, setObjectUrl] = useState("");

  // file puede ser:
  // - un File/Blob (recién seleccionado)
  // - un registro persistido con { url: 'https://...' }
  // - un string relativo a /public
  const previewSrc = useMemo(() => {
    if (file.url) return file.url;                       // URL remota (ya subida)
    if (typeof file.path === "string" && file.path.startsWith("/")) {
      return encodeURI(file.path);                       // archivo servido desde /public
    }
    return objectUrl;                                    // Object URL creado abajo
  }, [file.url, file.path, objectUrl]);

  useEffect(() => {
    // Si es un File/Blob, crear Object URL
    if (file instanceof File || file?.path instanceof File) {
      const f = file instanceof File ? file : file.path;
      const url = URL.createObjectURL(f);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url); // cleanup
    }
  }, [file]);

  return (
    <Card variant="outlined" sx={{ display: "flex", alignItems: "center", p: 1, maxWidth: 420 }}>
      {isImage && previewSrc ? (
        <CardMedia
          component="img"
          image={previewSrc}
          alt={file.name}
          sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: 1, mr: 2 }}
        />
      ) : (
        <Box sx={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100", borderRadius: 1, mr: 2 }}>
          <InsertDriveFileIcon color="action" fontSize="large" />
        </Box>
      )}

      <CardContent sx={{ flex: 1, p: 0 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-all" }}>
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatSize(file.size)} — {file.type}
          </Typography>
        </Stack>
      </CardContent>

      {onDelete && (
        <IconButton onClick={() => onDelete(file)} size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Card>
  );
}