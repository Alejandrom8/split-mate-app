import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  IconButton,
  Badge,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Search input + Filter button with menu
 * - Filters: ownership (tuyos, compartidos), date range (from/to)
 * - Shows a red badge with the count of active filters
 * - Minimal deps: pure MUI 5 (no MUI X). Uses native date inputs.
 */

const BRAND = {
  primary: "#4C6FFF",
  secondary: "#FFE500",
  navy: "#12172A",
};

const CircleIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 999,
  backgroundColor: 'rgba(0,0,0,0.06)',
}));

function getActiveFilterCount(f) {
  let n = 0;
  if (f.ownership && f.ownership !== "todos") n++;
  if (f.from) n++;
  if (f.to) n++;
  return n;
}

function useFilters(initial) {
  const [filters, setFilters] = React.useState({
    ownership: initial?.ownership ?? "todos",
    from: initial?.from,
    to: initial?.to,
  });
  const clear = () => setFilters({ ownership: "todos", from: undefined, to: undefined });
  return { filters, setFilters, clear };
}

export function FilterMenuButton({
  filters,
  setFilters,
  onApply,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const activeCount = getActiveFilterCount(filters);

  const handleOpen = (evt) => setAnchorEl(evt.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    onApply?.(filters);
    handleClose();
  };

  const handleClear = () => {
    setFilters((prev) => ({ ...prev, ownership: "todos", from: undefined, to: undefined }));
  };

  return (
    <>
    <CircleIconButton aria-label="Filtros" onClick={handleOpen} size='small'>
      <FilterAltIcon fontSize="medium"/>
    </CircleIconButton>

      <MuiMenu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 6,
          sx: {
            mt: 1.2,
            minWidth: 280,
            borderRadius: 1,
            p: 1,
          },
        }}
        // No animation version (optional): TransitionComponent={React.Fragment}
      >
        <Box sx={{ px: 1, py: 0.5 }}>
          <Typography variant="overline" color="text.secondary">Pertenencia</Typography>
          <RadioGroup
            row
            value={filters.ownership}
            onChange={(e) => setFilters((prev) => ({ ...prev, ownership: e.target.value }))}
            sx={{ px: 1, gap: 2, alignItems: "center" }}
          >
            <FormControlLabel value="todos" control={<Radio size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PersonRoundedIcon fontSize="small"/><span>Todos</span></Box>} />
            <FormControlLabel value="tuyos" control={<Radio size="small" />} label="Tuyos" />
            <FormControlLabel value="compartidos" control={<Radio size="small" />} label="Compartidos" />
          </RadioGroup>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 1 }}>
          <Typography variant="overline" color="text.secondary">Fecha</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ px: 1, py: 1 }}>
            <TextField
              type="date"
              label="Desde"
              size="small"
              value={filters.from ?? ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value || undefined }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="Hasta"
              size="small"
              value={filters.to ?? ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value || undefined }))}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", px: 1, pb: 1 }}>
          <Button variant="text" color="inherit" onClick={handleClear}>Limpiar</Button>
          <Button variant="contained" onClick={handleApply}>Aplicar</Button>
        </Box>
      </MuiMenu>
    </>
  );
}

// Example integration with your provided TextField
export default function SearchInput() {
  const [query, setQuery] = React.useState("");
  const { filters, setFilters, clear } = useFilters();

  function fetchSpaces() {
    console.log("fetch: ", { query, filters });
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") fetchSpaces();
  }
  function handleClearSearch() {
    setQuery("");
  }

  return (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="center" 
      sx={{ 
        py: 2, px: 3, borderRadius: 2, width: '50vw',
        border: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <TextField
        size="small"
        sx={{ width: { xs: '70vw', sm: '55vw', md: '100%' }, borderRadius: 0 }}
        variant="outlined"
        value={query}
        onKeyDown={handleKeyDown}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca por nombre o descripción"
        InputProps={{
          startAdornment: <IconButton onClick={() => query.length > 0 && fetchSpaces()} size='small'>
            <SearchIcon fontSize="medium" />
          </IconButton>,
          endAdornment: <Stack direction={'row'} alignItems={'center'}>
            {
                query?.length > 0 && (
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon fontSize="medium"/>
                  </IconButton>
                )
            }
          </Stack>
        }}
      />
      <FilterMenuButton
        filters={filters}
        setFilters={setFilters}
        onApply={() => fetchSpaces()}
      />
    </Stack>
  );
}
