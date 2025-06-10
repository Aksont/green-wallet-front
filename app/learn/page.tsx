"use client";

import { requireAuth } from "@/utils/auth";
import { Box } from "@mui/material";
import { useEffect } from "react";

export default function LearnPage() {
  useEffect(() => {
    requireAuth();
  }, []);

  return <Box sx={{ position: "relative" }}></Box>;
}
