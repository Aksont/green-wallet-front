"use client";

import {
  Container,
  Tab,
  Tabs,
  Typography,
  Grid,
  GridProps,
  Box,
  FormControl,
  MenuItem,
  Select,
  Fab,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import TripCard from "@/components/TripCard";
import { useRouter } from "next/navigation";
import axios from "axios";
import { requireAuth } from "@/utils/auth";

interface Trip {
  id: string;
  title: string;
  from: Location;
  to: Location;
  startDate: Date;
  endDate: Date;
}

export default function TripsPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    requireAuth();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/trips/for-user/` +
            localStorage.getItem("userId")
        );
        console.log("results: ", res.data);
        setTrips(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }

    fetchProjects();
  }, []);

  const filteredTrips = trips
    .filter((trip) =>
      tab === 0
        ? new Date(trip.endDate) > new Date()
        : new Date(trip.endDate) <= new Date()
    )
    .sort((a, b) => {
      if (sortBy === "start") {
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      } else {
        return 0 - 0; // Newest first based on ID
      }
    });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Upcoming Trips" />
        <Tab label="Past Trips" />
      </Tabs>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            displayEmpty
          >
            <MenuItem value="newest">Sort by Newest Added</MenuItem>
            <MenuItem value="start">Sort by Start Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTrips.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No trips yet.
          </Typography>
          <Button variant="contained" onClick={() => router.push("/trips/new")}>
            Create Your First Trip
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredTrips.map((trip) => (
              <Grid
                item
                xs={12}
                key={trip.id}
                component="div"
                {...({} as GridProps)}
              >
                <TripCard {...trip} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ height: 40 }} />{" "}
          {/* adds padding space below content so that navbar would not be overlaying the last card */}
        </>
      )}

      {filteredTrips.length !== 0 && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => router.push("/trips/new")}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            zIndex: 10,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
}
