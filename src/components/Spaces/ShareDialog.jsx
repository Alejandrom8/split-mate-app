import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  IconButton,
  Button,
  Tooltip,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function ShareDialog({ open, onClose, shareUrl }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for insecure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "visible",
        },
      }}
    >
      <Card elevation={3} sx={{ m: 0.5, borderRadius: 3 }}>
        <CardContent>
          <DialogTitle sx={{ px: 0, pt: 0 }}>
            <Typography variant="h6" fontWeight={700}>
              Compartir
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Comparte este espacio con tus amigos y empiecen a subir sus tickets!
            </Typography>

            <TextField
              fullWidth
              value={shareUrl}
              InputProps={{
                readOnly: true,
                sx: {
                  pr: 0.5,
                  height: 48,
                  maxWidth: '600px',
                  "& .MuiInputBase-input": { fontFamily: "monospace" },
                },
                endAdornment: (
                  <Tooltip title={copied ? "Copiado!" : "Copiar enlace"} placement="top">
                    <IconButton onClick={handleCopy} aria-label="Copiar enlace" edge="end">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 0, pb: 0 }}>
            <Box sx={{ flex: 1 }} />
            <Button onClick={onClose} variant="contained" disableElevation>
              Listo
            </Button>
          </DialogActions>
        </CardContent>
      </Card>
    </Dialog>
  );
}