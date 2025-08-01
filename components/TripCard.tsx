"use client";

import {
  Box,
  Chip,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import FlightIcon from "@mui/icons-material/Flight";
import { JSX, useEffect, useState } from "react";
import ReportIcon from "@mui/icons-material/Report";
import CompostIcon from "@mui/icons-material/Compost";
import axios from "axios";
import NextLink from "next/link";
import ParkIcon from "@mui/icons-material/Park";

// interface Segment {
//   from: string;
//   to: string;
//   type: string;
//   distance: number;
//   co2: number;
// }

interface TripCardProps {
  id: string;
  title: string;
  from: Location;
  to: Location;
  startDate: Date;
  endDate: Date;
  sequences: Sequence[];
  returnSequences?: Sequence[];
  totalDistanceInKm: number;
  totalCo2emissionInKg: number;
}

export interface Trip {
  id: string;
  title: string;
  from: Location;
  to: Location;
  startDate: Date;
  endDate: Date;
  sequences: Sequence[];
  returnSequences?: Sequence[];
  totalDistanceInKm: number;
  totalCo2emissionInKg: number;
}

export interface Sequence {
  from: Location;
  to: Location;
  date?: Date;
  transportType: string;
  distanceInKm: number;
  co2emissionInKg: number;
}

export interface Location {
  name: string; // can't find always airports only by IATA, therefore city and airport have only 'name
  country: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
}

export default function TripCard({
  title,
  startDate,
  endDate,
  totalDistanceInKm,
  totalCo2emissionInKg,
  sequences,
  returnSequences,
  id,
}: TripCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isCompensated, setIsCompensated] = useState(false);

  useEffect(() => {
    async function fetchIsCompensated(id: string) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/is-compensated/${id}`
        );
        setIsCompensated(res.data);
      } catch (error) {
        console.error("Failed to fetch if the trip is compensated:", error);
      }
    }

    fetchIsCompensated(id);
  }, []);

  const transportIcons: Record<string, JSX.Element> = {
    WALK: <DirectionsWalkIcon fontSize="small" />,
    BICYCLE: <DirectionsBikeIcon fontSize="small" />,
    CAR: <DirectionsCarIcon fontSize="small" />,
    BUS: <DirectionsBusIcon fontSize="small" />,
    TRAIN: <TrainIcon fontSize="small" />,
    PLANE: <FlightIcon fontSize="small" />,
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          component={NextLink}
          href={`/trips/${id}`}
          underline="none"
          sx={{
            color: "inherit",
            "&:hover": {
              color: "primary.main",
              cursor: "pointer",
            },
          }}
        >
          <Typography variant="h6">{title}</Typography>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={
              returnSequences && returnSequences.length > 0
                ? "Return trip"
                : "One-way"
            }
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Tooltip
            title={
              isCompensated
                ? "Trip has been compensated"
                : "Waiting to be compensated"
            }
            enterTouchDelay={0}
          >
            <Box component="span" sx={{ cursor: "pointer" }}>
              {isCompensated ? (
                <CompostIcon color="success" />
              ) : (
                <ReportIcon color="warning" />
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {new Date(startDate).toLocaleDateString()} —{" "}
        {new Date(endDate).toLocaleDateString()}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        {/* <Typography variant="body2" color="text.secondary">
          {sequences.length + (returnSequences?.length ?? 0)} segments
        </Typography> */}
        <Typography variant="body2" color="text.secondary">
          {totalDistanceInKm.toFixed(1)} km
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalCo2emissionInKg.toFixed(1)} kg CO₂
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ParkIcon fontSize="small" sx={{ ml: 0.5 }} />

          {(totalCo2emissionInKg / 225).toFixed(1)}
        </Typography>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <IconButton onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {sequences.map((seg, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              {transportIcons[seg.transportType] || (
                <DirectionsWalkIcon fontSize="small" />
              )}
              <Typography variant="body2">{seg.from.name}</Typography>
              <Typography variant="body2">→</Typography>
              <Typography variant="body2">{seg.to.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {seg.distanceInKm.toFixed(1)} km
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {seg.co2emissionInKg.toFixed(1)} kg CO₂
              </Typography>
            </Box>
          ))}
        </Box>
        {returnSequences && returnSequences.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Box sx={{ flex: 1, height: "1px", backgroundColor: "grey.400" }} />
          </Box>
        )}
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {returnSequences?.map((seg, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              {transportIcons[seg.transportType] || (
                <DirectionsWalkIcon fontSize="small" />
              )}
              <Typography variant="body2">{seg.from.name}</Typography>
              <Typography variant="body2">→</Typography>
              <Typography variant="body2">{seg.to.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {seg.distanceInKm.toFixed(1)} km
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {seg.co2emissionInKg.toFixed(1)} kg CO₂
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Paper>
  );
}
