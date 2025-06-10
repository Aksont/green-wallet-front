// components/LocationAutocomplete.tsx

import { Autocomplete, TextField } from "@mui/material";
import { LocationDto } from "@/dto/location.dto";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";

interface LocationAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locations: LocationDto[];
  required?: boolean;
}

const StyledPopper = styled(Popper)({
  "& .MuiAutocomplete-listbox": {
    maxHeight: "200px", // ~5 items depending on item height
    overflowY: "auto",
  },
});

export default function LocationAutocomplete({
  label,
  value,
  onChange,
  locations,
  required = false,
}: LocationAutocompleteProps) {
  return (
    <Autocomplete
      freeSolo
      options={locations}
      PopperComponent={StyledPopper} // shows scrollable options
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.showName
      }
      filterOptions={(options, { inputValue }) => {
        if (inputValue.length < 3) return [];
        return options.filter(
          (opt) =>
            opt.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
            opt.country?.toLowerCase().includes(inputValue.toLowerCase()) ||
            opt.iata?.toLowerCase().includes(inputValue.toLowerCase())
        );
        // .slice(0, 5); // limit to 5 suggestions
      }}
      inputValue={value}
      onInputChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            width: "300px", //TODO hardcoded because of Autocomplete, nothing else would work
          }}
        />
      )}
    />
  );
}
