// components/MiniNumericInput.jsx
import * as React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function MiniNumericInput({
                                           value,
                                           onChange,
                                           min = 0,
                                           max = 99,
                                           step = 1,
                                         }) {
  const commit = (next) => {
    const num = Number(next);
    if (!isNaN(num)) {
      if (min != null && num < min) return onChange(min);
      if (max != null && num > max) return onChange(max);
      onChange(num);
    }
  };

  const increment = () => commit((Number(value) || 0) + step);
  const decrement = () => commit((Number(value) || 0) - step);

  const handleChange = (e) => {
    const v = e.target.value;
    if (v > max) return;
    if (/^\d*$/.test(v)) onChange(v === "" ? "" : Number(v));
  };

  const handleBlur = () => {
    if (value === "") onChange(min);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <IconButton
        size="small"
        onClick={decrement}
        disabled={value <= min}
        sx={{ border: "1px solid", borderColor: "divider", width: 28, height: 28 }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <TextField
        value={Math.floor(value)}
        onChange={handleChange}
        onBlur={handleBlur}
        size="small"
        inputProps={{
          step: 1,       // solo enteros
          min,
          max,
          inputMode: "numeric",
          pattern: "[0-9]*",
          style: { textAlign: "center", width: 40, padding: "4px 0" },
        }}
      />

      <IconButton
        size="small"
        onClick={increment}
        disabled={value >= max}
        sx={{ border: "1px solid", borderColor: "divider", width: 28, height: 28 }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}