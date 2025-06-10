"use client";

import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

const causes = ["Environment", "Culture Preservation", "Community", "Health"];

export default function ExploreFilters({ show }: { show: boolean }) {
  return (
    <Collapse in={show} timeout="auto" unmountOnExit>
      <Box
        sx={{
          mb: 4,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Filter By:
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormLabel>Distance (km)</FormLabel>
          <Slider
            defaultValue={50}
            max={100}
            min={0}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormLabel>Type</FormLabel>
          <RadioGroup row defaultValue="both">
            <FormControlLabel
              value="project"
              control={<Radio />}
              label="Projects"
            />
            <FormControlLabel
              value="challenge"
              control={<Radio />}
              label="Challenges"
            />
            <FormControlLabel value="both" control={<Radio />} label="Both" />
          </RadioGroup>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormLabel>Cause</FormLabel>
          <FormGroup row>
            {causes.map((cause) => (
              <FormControlLabel
                key={cause}
                control={<Checkbox />}
                label={cause}
              />
            ))}
          </FormGroup>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormLabel>Participation Type</FormLabel>
          <RadioGroup row defaultValue="both">
            <FormControlLabel
              value="join"
              control={<Radio />}
              label="Join Anytime"
            />
            <FormControlLabel
              value="full"
              control={<Radio />}
              label="Full Length"
            />
            <FormControlLabel value="both" control={<Radio />} label="Both" />
          </RadioGroup>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>
    </Collapse>
  );
}
