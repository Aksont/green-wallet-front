"use client";

import {
  Box,
  Button,
  Container,
  Fab,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Modal,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useEffect, useState } from "react";
import MarketFilters from "@/components/MarketFilters";
import MarketCardGrid from "@/components/MarketCardGrid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { requireAuth } from "@/utils/auth";

export default function MarketPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    requireAuth();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Filters
        </Button>

        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="distance">Sort by Distance</MenuItem>
            <MenuItem value="popularity">Sort by Popularity</MenuItem>
            <MenuItem value="has_coupon">Sort by Has Coupon</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <MarketFilters show={showFilters} />

      <Typography variant="h6" gutterBottom>
        [TODO:] Should have map with locations
      </Typography>

      <MarketCardGrid />
      <Fab
        color="secondary"
        onClick={() => setOpenModal(true)}
        sx={{
          position: "fixed",
          bottom: 80, // above bottom nav
          right: 16,
          zIndex: 1200,
          boxShadow: 4,
        }}
      >
        <AccountBalanceWalletIcon />
      </Fab>

      <Modal // for coupons
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 300,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Your Coupons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Just a placeholder for now)
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
}
