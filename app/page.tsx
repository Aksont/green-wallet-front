"use client";

import { Typography, Button, Container } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        py: 4,
      }}
    >
      <Image
        src="/DWGT_logo_no_bg.png"
        alt="DWGT Logo"
        width={100}
        height={100}
        style={{ marginBottom: "2rem" }}
      />

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, color: "text.primary" }}
      >
        Digital Wallet for Green Travel
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 500,
          color: "text.secondary",
          mb: 4,
          fontSize: "1.1rem",
          whiteSpace: "pre-line",
        }}
      >
        {`Travel greener. Give back smarter. \nProve it effortlessly.`}
      </Typography>

      <Button
        variant="contained"
        size="large"
        component={Link}
        href="/auth"
        sx={{
          borderRadius: "9999px",
          px: 4,
          py: 1.5,
          textTransform: "none",
          fontWeight: 600,
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        Become a Green Traveler
      </Button>

      <Typography
        variant="body2"
        sx={{
          maxWidth: 500,
          color: "text.secondary",
          mt: 2,
          fontStyle: "italic",
        }}
      >
        Because sustainability shouldn`t end where the road begins.
      </Typography>
    </Container>
  );
}
