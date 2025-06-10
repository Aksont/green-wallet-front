"use client";

import { Box, Button, Chip, Typography, useTheme } from "@mui/material";

interface MarketCardProps {
  name: string;
  type: string;
  distance: number;
  image: string;
  hasCoupon: boolean;
}

export default function MarketCard({
  name,
  type,
  distance,
  image,
  hasCoupon,
}: MarketCardProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: "1px solid",
        borderRadius: 2,
        p: 2,
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        borderColor: hasCoupon ? theme.palette.success.main : "divider",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{
          width: "100%",
          height: 160,
          objectFit: "cover",
          borderRadius: 1,
          mb: 2,
        }}
      />

      {hasCoupon && (
        <Chip
          label="Coupon Available"
          color="success"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 600,
          }}
        />
      )}

      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>

      <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip label={type} size="small" />
        <Chip label={`${distance} km`} size="small" />
      </Box>

      <Button
        sx={{
          position: "absolute",
          bottom: 12,
          right: 12,
          fontWeight: 500,
          textTransform: "none",
        }}
        variant="contained"
        size="small"
      >
        Take me there!
      </Button>
    </Box>
  );
}
