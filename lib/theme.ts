import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e3a25", // charcoal/dark gray for strong contrast
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d97706", // warm amber/orange for friendly highlights
    },
    background: {
      default: "#e6f4ea", // soft green tint, works with your bg image
      paper: "#a3f3c3", // white for cards/panels
    },
    text: {
      primary: "#1e3a25", // dark forest green for readable text
      secondary: "#0c4a2d", // muted gray for labels/hints
      // 3c4f46, 40624a, 32573e -> primary good
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4ade80", // soft green (like Tailwind's green-400)
      contrastText: "#0f1f1b",
    },
    secondary: {
      main: "#86efac", // lighter green for accents
    },
    background: {
      default: "#0f1f1b", // deep forest green
      paper: "#1a2e25", // slightly lighter surface
    },
    text: {
      primary: "#ffffff",
      secondary: "#a3f3c3", // minty green-gray
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
  },
});
