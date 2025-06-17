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
  Button,
} from "@mui/material";
import axios from "axios";
import TripCard, { Trip } from "@/components/TripCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProofModal from "@/components/ProofModal";
import CompensationSuggestionsModal from "@/components/CompensationSuggestionsModal";
import { isRequiredUsedLogged } from "@/utils/auth";

export default function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const [proof, setProof] = useState(null);
  const [openProofModal, setOpenProofModal] = useState(false);

  const [suggestions, setSuggestions] = useState(null);
  const [openSuggestionsModal, setOpenSuggestionsModal] = useState(false);

  const [userId, setUserId] = useState<string>();
  const [isCompensated, setIsCompensated] = useState(false);

  const [isUserLogged, setIsUserLogged] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId ? userId : "");

    if (userId) {
      const isIn = isRequiredUsedLogged(userId);
      setIsUserLogged(isIn);
    }
  }, []);

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

  useEffect(() => {
    async function fetchIsCompensated() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/is-compensated/${trip?.id}`
        );
        setIsCompensated(res.data);
      } catch (error) {
        console.error("Failed to fetch if the trip is compensated:", error);
      }
    }

    if (!trip) return;
    fetchIsCompensated();
  }, [trip]);

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

  const handleClick = async () => {
    if (isCompensated) {
      fetchProof();
    } else {
      if (localStorage.getItem("userId")) {
        fetchSuggestions();
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (!trip) return <Typography>Trip not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {userId && (
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
        <Grid item xs={12} component="div" {...({} as GridProps)}>
          <TripCard {...trip} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        {/* {isUserLogged && (
          <Button variant="contained" onClick={() => handleClick()}>
            {isCompensated
              ? `Show Proof of Compensation`
              : `See Compensation Suggestions`}
          </Button>
        )} */}
        {isCompensated ? (
          <Button variant="contained" onClick={() => handleClick()}>
            Show Proof of Compensation
          </Button>
        ) : (
          isUserLogged && (
            <Button variant="contained" onClick={() => handleClick()}>
              See Compensation Suggestions
            </Button>
          )
        )}
      </Box>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onConfirm={(type: any, project: any, value: any) => {
            // Handle confirmation logic here (API call, state update, etc.)
            console.log("Confirmed", type, project, value);
            setOpenSuggestionsModal(false);
          }}
          onCompensate={() => {
            // implement the logic here or pass a real handler
            console.log("Compensate triggered");
          }}
          tripTotalCo2={trip.totalCo2emissionInKg}
          tripId={trip.id}
        />
      )}
    </Container>
  );
}
