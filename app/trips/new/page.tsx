"use client";

import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { GridProps } from "@mui/material/Grid";
import SegmentList from "@/components/NewSegmentList";
import { SequenceDto } from "@/dto/sequence.dto";
import { isSegmentValid } from "@/utils/segment-validation";
import axios from "axios";
import { LocationDto } from "@/dto/location.dto";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import { requireAuth } from "@/utils/auth";

const transportOptions = ["Walk", "Bicycle", "Car", "Bus", "Train", "Plane"];

export default function NewTripPage() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sequences, setSequences] = useState<SequenceDto[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [returnSequences, setReturnSequences] = useState<any[]>([]);
  const [showReturn, setShowReturn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_TRANSPORT_TYPE = "Train";

  const [locations, setLocations] = useState<LocationDto[]>([]);

  useEffect(() => {
    requireAuth();
  }, []);

  useEffect(() => {
    fetch("/locations.json")
      .then((res) => res.json())
      .then(setLocations)
      .catch((err) => console.error("Failed to load locations", err));
  }, []);

  useEffect(() => {
    if (sequences.length === 0 && fromLocation && startDate) {
      setSequences([
        {
          from: fromLocation,
          to: "",
          transportType: DEFAULT_TRANSPORT_TYPE,
          date: startDate,
        },
      ]);
    }
  }, [fromLocation, startDate]);

  const addSegment = () => {
    const prev = sequences[sequences.length - 1];
    if (sequences.length && !isSegmentValid(prev)) {
      return setError(
        "Please complete the previous segment before adding a new one."
      );
    }

    setSequences([
      ...sequences,
      {
        from: prev?.to || "",
        to: "",
        transportType: DEFAULT_TRANSPORT_TYPE,
        date: prev?.date || startDate,
      },
    ]);
  };

  const addReturnSegment = () => {
    if (sequences.length === 0) {
      return setError(
        "Can not add a return trip, if there are no outbound trip segments."
      );
    }

    let prev = sequences[sequences.length - 1];
    if (sequences.length && !isSegmentValid(prev)) {
      return setError(
        "Please complete the last outbound segment before adding a return trip."
      );
    }

    if (returnSequences.length !== 0) {
      prev = returnSequences[returnSequences.length - 1];
    }

    const lastTo = prev?.to || "";
    const lastDate = prev?.date || endDate;

    setReturnSequences([
      ...returnSequences,
      {
        from:
          returnSequences.length === 0
            ? lastTo
            : returnSequences[returnSequences.length - 1].to,
        to: "",
        transportType: DEFAULT_TRANSPORT_TYPE,
        date:
          returnSequences.length === 0
            ? lastDate
            : returnSequences[returnSequences.length - 1].date,
      },
    ]);
  };

  const handleSegmentChange = (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setter: Function,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: any[],
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  const isTripInputValid = (): boolean => {
    setError(null);

    if (
      !title.trim() ||
      !fromLocation.trim() ||
      !toLocation.trim() ||
      !startDate ||
      !endDate
    ) {
      setError("Please fill in all required trip fields.");
      return false;
    }

    if (endDate < startDate) {
      setError("End date can't be before start date");
      return false;
    }

    const allSegments = [...sequences, ...returnSequences];

    for (let i = 0; i < allSegments.length; i++) {
      const seg = allSegments[i];
      if (!isSegmentValid(seg)) {
        setError(`Segment ${i + 1} is incomplete.`);
        return false;
      }
      if (seg.date < startDate || seg.date > endDate) {
        setError(`Segment ${i + 1} date must be within trip date range`);
        return false;
      }
      if (i > 0 && allSegments[i].date < allSegments[i - 1].date) {
        setError(`Segment ${i + 1} date can't be before previous segment date`);
        return false;
      }

      const segTransportType = seg.transportType.toUpperCase();
      const segFrom = locations.find((loc) => loc.showName === seg.from);
      const segTo = locations.find((loc) => loc.showName === seg.to);

      console.log(segTransportType === "PLANE");
      console.log(segTo?.type !== "AIRPORT");
      console.log(segFrom?.type !== "AIRPORT");
      console.log(segFrom?.type !== "AIRPORT" || segTo?.type !== "AIRPORT");
      console.log(
        segTransportType === "PLANE" &&
          (segFrom?.type !== "AIRPORT" || segTo?.type !== "AIRPORT")
      );

      if (
        segTransportType === "PLANE" &&
        (segFrom?.type !== "AIRPORT" || segTo?.type !== "AIRPORT")
      ) {
        setError(
          `Segment ${
            i + 1
          } has to travel between two airports. Recognize airports with IATA code in [].`
        );
        return false;
      }
    }

    return true;
  };

  const resetTripForm = () => {
    setTitle("");
    setStartDate("");
    setEndDate("");
    setFromLocation("");
    setToLocation("");
    setSequences([]);
    setReturnSequences([]);
    setShowReturn(false);
    setError(null);
  };

  const resetSegmentsValues = () => {
    const allSegments = [...sequences, ...returnSequences];

    for (let i = 0; i < allSegments.length; i++) {
      const seg = allSegments[i];
      seg.transportType =
        seg.transportType.charAt(0).toUpperCase() +
        seg.transportType.slice(1).toLowerCase();
      seg.from = seg.from.showName;
      seg.to = seg.to.showName;
    }
  };

  const handleSubmit = async () => {
    if (!isTripInputValid()) {
      return;
    }

    const allSegments = [...sequences, ...returnSequences];

    for (let i = 0; i < allSegments.length; i++) {
      const seg = allSegments[i];
      seg.transportType = seg.transportType.toUpperCase();
      seg.from = locations.find((loc) => loc.showName === seg.from);
      seg.to = locations.find((loc) => loc.showName === seg.to);
    }

    const newTrip = {
      userId: localStorage.getItem("userId"),
      title: title,
      from: locations.find((loc) => loc.showName === fromLocation),
      to: locations.find((loc) => loc.showName === toLocation),
      startDate,
      endDate,
      sequences: sequences,
      returnSequences: showReturn ? returnSequences : [],
    };

    console.log("Trip to be created:", newTrip);

    try {
      const response = await axios.post("http://localhost:3001/trips", newTrip);
      console.log("Trip successfully created:", response.data);
      resetTripForm();
      window.location.href = `/trips/${response.data.id}`;
    } catch (err) {
      console.error("Trip creation failed:", err);
      resetSegmentsValues();
      setError("Failed to create trip. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ height: 20 }} />{" "}
      {/* adds padding space above content so that title would not be overlaying the 'go back' arrow */}
      <IconButton
        component={Link}
        href="/trips"
        sx={{ position: "absolute", top: 16, left: 16 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" gutterBottom>
        Create New Trip
      </Typography>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          component="div"
          {...({} as GridProps)}
          sx={{ display: "flex" }}
        >
          <TextField
            label="Trip Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            sx={{
              width: "300px", // TODO forced because nothing else would work...
            }}
          />
        </Grid>

        <Grid item xs={6} component="div" {...({} as GridProps)}>
          {locations.length > 0 && (
            <LocationAutocomplete
              label="From"
              value={fromLocation}
              onChange={setFromLocation}
              locations={locations}
              required
            />
          )}
        </Grid>
        <Grid item xs={6} component="div" {...({} as GridProps)}>
          {locations.length > 0 && (
            <LocationAutocomplete
              label="To"
              value={toLocation}
              onChange={setToLocation}
              locations={locations}
              required
            />
          )}
        </Grid>

        <Grid item xs={6} component="div" {...({} as GridProps)}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={6} component="div" {...({} as GridProps)}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            error={!!startDate && !!endDate && endDate < startDate}
            helperText={
              !!startDate && !!endDate && endDate < startDate
                ? "End date cannot be before start date"
                : " "
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 20 }} />{" "}
      {/* adds padding space between Trip input and Outbout segments*/}
      <Grid container spacing={2}>
        <SegmentList
          segments={sequences}
          setter={setSequences}
          onChange={handleSegmentChange}
          onAdd={addSegment}
          title="Outbound Segments"
          prefix="outbound-"
          transportOptions={transportOptions}
          tripStartDate={startDate}
          tripEndDate={endDate}
          locations={locations}
        />
      </Grid>
      <Box sx={{ height: 20 }} />{" "}
      {/* adds padding space between Outbout segments and Return segments*/}
      <Grid container spacing={2}>
        {sequences.length !== 0 && !showReturn && (
          <Grid item xs={12} component="div" {...({} as GridProps)}>
            <Button
              variant="text"
              onClick={() => {
                // addReturnSegment();
                setShowReturn(true);
              }}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Return Trip
            </Button>
          </Grid>
        )}

        {showReturn && (
          <SegmentList
            segments={returnSequences}
            setter={setReturnSequences}
            onChange={handleSegmentChange}
            onAdd={addReturnSegment}
            title="Return Segments"
            prefix="return-"
            transportOptions={transportOptions}
            tripStartDate={startDate}
            tripEndDate={endDate}
            locations={locations}
          />
        )}
      </Grid>
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12} component="div" {...({} as GridProps)}>
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} component="div" {...({} as GridProps)}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 3 }}
          >
            Create Trip
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ height: 40 }} />{" "}
      {/* adds padding space below content so that navbar would not be overlaying the last card */}
    </Container>
  );
}
