// app/trips/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Grid,
  GridProps,
  IconButton,
  Link,
  Container,
  Box,
} from "@mui/material";
import axios from "axios";
import TripCard from "@/components/TripCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProofModal from "@/components/ProofModal";
import CompensationSuggestionsModal from "@/components/CompensationSuggestionsModal";

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const [proof, setProof] = useState(null);
  const [openProofModal, setOpenProofModal] = useState(false);

  const [suggestions, setSuggestions] = useState(null);
  const [openSuggestionsModal, setOpenSuggestionsModal] = useState(false);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/trips/` + id
        );
        setTrip(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
      }
    }

    fetchTrip();
  }, [id]);

  const fetchProof = async () => {
    console.log("fetch");
    if (proof) {
      console.log("vec ima proof");
      setOpenProofModal(true);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/proofs/${id}`
      );
      setProof(res.data);
      console.log(res.data);
      setOpenProofModal(true);
    } catch (error) {
      console.error(`Failed to fetch the proof for trip[${id}]:`, error);
    }
  };

  const fetchSuggestions = async () => {
    if (suggestions) {
      setOpenSuggestionsModal(true);
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/suggestions/${id}`
      );
      setSuggestions(res.data);
      setOpenSuggestionsModal(true);
    } catch (error) {
      console.error(`Failed to fetch the proof for trip[${id}]:`, error);
    }
  };

  if (loading) return <CircularProgress />;
  if (!trip) return <Typography>Trip not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {localStorage.getItem("userId") && (
        <IconButton
          component={Link}
          href="/trips"
          sx={{ position: "absolute", top: 16, left: 16 }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box sx={{ height: 50 }} />{" "}
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          component="div"
          {...({} as GridProps)}
          //   padding={"15px"}
        >
          <TripCard
            onProofClick={() => fetchProof()}
            onSuggestionsClick={() => fetchSuggestions()}
            {...trip}
          />
        </Grid>
      </Grid>
      {proof && (
        <ProofModal
          open={openProofModal}
          onClose={() => setOpenProofModal(false)}
          proof={proof}
          userProfileImgUrl="/profile.png"
          tripName={"Trip title"}
        />
      )}
      {!proof && suggestions && (
        <CompensationSuggestionsModal
          open={openSuggestionsModal}
          onClose={() => setOpenSuggestionsModal(false)}
          suggestions={suggestions}
          onConfirm={(type, project, value) => {
            // Handle confirmation logic here (API call, state update, etc.)
            console.log("Confirmed", type, project, value);
            setOpenSuggestionsModal(false);
          }}
          tripTotalCo2={trip.totalCo2emissionInKg}
          tripId={trip.id}
        />
      )}
    </Container>
  );
}
