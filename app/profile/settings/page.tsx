"use client";

import { Box, Typography, Button } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import ThemeModeSwitch from "@/components/ThemeModeSwitch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { requireAuth } from "@/utils/auth";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { mode, toggleMode } = useThemeContext();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    requireAuth();
    const userId = localStorage.getItem("userId");
    setUserId(userId ? userId : "");
  }, []);

  return (
    <Box sx={{ padding: "2rem", position: "relative" }}>
      <Button
        variant="text"
        component={Link}
        href={`/profile`}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          minWidth: 0,
          width: 40,
          height: 40,
          padding: 0,
          borderRadius: "50%",
          color: "text.primary",
        }}
      >
        <ArrowBackIcon />
      </Button>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Settings for User ID: {userId}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Current theme: <strong>{mode}</strong>
        </Typography>
        <ThemeModeSwitch checked={mode === "dark"} onChange={toggleMode} />
      </Box>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 4 }}
        component={Link}
        href="/"
        onClick={() => {
          localStorage.removeItem("userId");
        }}
      >
        Log out
      </Button>
    </Box>
  );
}
