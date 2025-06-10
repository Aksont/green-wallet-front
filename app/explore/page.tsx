"use client";

import {
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Suspense, useEffect, useState } from "react";

import ExploreFilters from "@/components/ExploreFilters";
import ExploreCardGrid from "@/components/ExploreCardGrid";
import { requireAuth } from "@/utils/auth";

export default function ExplorePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("distance");

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
            <MenuItem value="recent">Sort by Recent</MenuItem>
            <MenuItem value="popularity">Sort by Popularity</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ExploreFilters show={showFilters} />

      <Suspense fallback={<div>Loading...</div>}>
        <ExploreCardGrid />
      </Suspense>
    </Container>
  );
}
