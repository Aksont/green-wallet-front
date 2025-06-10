"use client";

import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GridProps } from "@mui/material/Grid";
import { FC } from "react";
import { SequenceDto } from "@/dto/sequence.dto";
import { isSegmentDateValid } from "@/utils/segment-validation";
import LocationAutocomplete from "./LocationAutocomplete";
import { LocationDto } from "@/dto/location.dto";

interface SegmentListProps {
  segments: SequenceDto[];
  onChange: (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setter: Function,
    list: SequenceDto[],
    index: number,
    field: string,
    value: string | number // allowed number because of numOfPassangers and distance [Walk/Bicycle]
  ) => void;
  onAdd: () => void;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  setter: Function;
  title?: string;
  prefix: string;
  transportOptions: string[];
  tripStartDate: string;
  tripEndDate: string;
  locations: LocationDto[];
}

const SegmentList: FC<SegmentListProps> = ({
  segments,
  onChange,
  onAdd,
  setter,
  title,
  prefix,
  transportOptions,
  tripStartDate,
  tripEndDate,
  locations,
}) => {
  return (
    <>
      {title && (
        <Grid item xs={12} component="div" {...({} as GridProps)}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Grid>
      )}

      {segments.map((segment, i) => (
        <Grid container spacing={2} key={`${prefix}${i}`} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={4} component="div" {...({} as GridProps)}>
            <LocationAutocomplete
              label="From"
              value={segment.from}
              onChange={(val) => onChange(setter, segments, i, "from", val)}
              locations={locations}
            />
          </Grid>
          <Grid item xs={12} sm={4} component="div" {...({} as GridProps)}>
            <LocationAutocomplete
              label="To"
              value={segment.to}
              onChange={(val) => onChange(setter, segments, i, "to", val)}
              locations={locations}
            />
          </Grid>
          <Grid item xs={6} sm={2} component="div" {...({} as GridProps)}>
            <TextField
              label="Date"
              type="date"
              value={segment.date}
              onChange={(e) =>
                onChange(setter, segments, i, "date", e.target.value)
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={
                !!segment.date &&
                !isSegmentDateValid(
                  segment.date,
                  tripStartDate,
                  tripEndDate,
                  i > 0 ? segments[i - 1].date : undefined
                )
              }
              helperText={
                !!segment.date &&
                !isSegmentDateValid(
                  segment.date,
                  tripStartDate,
                  tripEndDate,
                  i > 0 ? segments[i - 1].date : undefined
                )
                  ? "Date must be within trip range and after previous segment"
                  : " "
              }
            />
          </Grid>
          <Grid item xs={6} sm={2} component="div" {...({} as GridProps)}>
            <FormControl fullWidth>
              <InputLabel>Transport</InputLabel>
              <Select
                value={segment.transportType}
                label="Transport"
                onChange={(e) => {
                  onChange(
                    setter,
                    segments,
                    i,
                    "transportType",
                    e.target.value
                  );
                }}
                sx={{
                  width: "120px", //TODO hardcoded because of Autocomplete, nothing else would work
                }}
              >
                {transportOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {segment.transportType === "Car" && (
            <>
              <Grid item xs={6} sm={2} component="div" {...({} as GridProps)}>
                <TextField
                  label="Passengers"
                  type="number"
                  inputProps={{ min: 1, max: 5 }}
                  value={segment.numOfPassangers || 1}
                  onChange={(e) =>
                    onChange(
                      setter,
                      segments,
                      i,
                      "numOfPassangers",
                      +e.target.value
                    )
                  }
                  fullWidth
                  sx={{
                    width: "100px",
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={4} component="div" {...({} as GridProps)}>
                <Typography variant="body2" color="textSecondary">
                  Emissions of the car will be averaged among all passengers.
                  Leave 1 if you would like to estimate for the whole car.
                </Typography>
              </Grid>
            </>
          )}
          {(segment.transportType === "Walk" ||
            segment.transportType === "Bicycle") && (
            <>
              <Grid item xs={6} sm={2} component="div" {...({} as GridProps)}>
                <TextField
                  label="Distance (km)"
                  type="number"
                  inputProps={{ min: 0.1, step: 0.1 }}
                  value={segment.distance}
                  onChange={(e) =>
                    onChange(setter, segments, i, "distance", +e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4} component="div" {...({} as GridProps)}>
                <Typography variant="body2" color="textSecondary">
                  Leave empty or 0 for the distance to be calculated.
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      ))}

      <Grid item xs={12} component="div" {...({} as GridProps)}>
        <Button
          startIcon={<AddIcon />}
          onClick={onAdd}
          variant="outlined"
          fullWidth
        >
          Add Segment
        </Button>
      </Grid>
    </>
  );
};

export default SegmentList;
