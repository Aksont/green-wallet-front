"use client";

import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  Typography,
  FormLabel,
  Slider,
} from "@mui/material";

export default function MarketFilters({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        mb: 3,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <FormLabel>Distance (km)</FormLabel>
        <Slider defaultValue={50} max={100} min={0} valueLabelDisplay="auto" />
      </Box>

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Filter Options
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <FormControl sx={{ minWidth: 140 }} size="small">
          <InputLabel>Type</InputLabel>
          <Select defaultValue="" label="Type">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="clothes">Clothes</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="restaurant">Restaurant</MenuItem>
            <MenuItem value="cafe">Café</MenuItem>
            <MenuItem value="sport">Sport</MenuItem>
            <MenuItem value="hobby">Hobby</MenuItem>
            <MenuItem value="gifts">Gifts</MenuItem>
            <MenuItem value="wellness">Wellness</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Checkbox defaultChecked={false} />}
          label="Has Coupon"
        />
      </Box>
    </Box>
  );
}
