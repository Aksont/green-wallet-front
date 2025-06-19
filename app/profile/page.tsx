"use client";

import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Paper,
  useTheme,
  GridProps,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import FactCheckIcon from "@mui/icons-material/FactCheck";
// import { useParams } from "next/navigation";
import axios from "axios";
import NextLink from "next/link";
import { Link as MuiLink } from "@mui/material";
import { requireAuth } from "@/utils/auth";
import { Trip } from "@/types/trip.interface";

export interface ProofOfCompensation {
  tripId: string;
  userId: string;
  trees: number;
  volunteerHours: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "ACTION_NEEDED" | "CLAIMED"; // Adjust if you have an enum
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  stats: {
    userId: string;
    trees: number;
    hours: number;
    totalCo2: number;
    compensatedCo2: number;
    averageCo2PerKm: number;
    totalTrips: number;
    compensatedTrips: number;
  };
}

export default function UserProfilePage() {
  const theme = useTheme();
  // const params = useParams();
  // const userId = params.id;
  const [openModal, setOpenModal] = useState(false);
  const [proofs, setProofs] = useState<ProofOfCompensation[]>([]);
  const [user, setUser] = useState<UserResponse>();
  const [stats, setStats] = useState<
    { label: string; value: number | string }[]
  >([]);
  const [proofsTrips, setProofsTrips] = useState<Trip[]>([]);
  const [userWallet, setUserWallet] = useState<string>();

  useEffect(() => {
    requireAuth();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleStats(stats: any) {
    const co2Percent =
      stats.totalCo2 !== 0
        ? `(${((stats.compensatedCo2 / stats.totalCo2) * 100).toFixed(2)}%)`
        : "";
    const tripsPercent =
      stats.totalTrips !== 0
        ? `(${((stats.compensatedTrips / stats.totalTrips) * 100).toFixed(2)}%)`
        : "";

    const _stats = [
      { label: "Trees", value: stats.trees },
      { label: "Hours", value: stats.hours },

      {
        label: "Co2e / km",
        value: stats.averageCo2PerKm ? stats.averageCo2PerKm.toFixed(2) : "0",
      },
      {
        label: "Compensated Co2 (kg)",
        value: `${stats.compensatedCo2.toFixed(2)} / ${stats.totalCo2.toFixed(
          2
        )} ${co2Percent}`,
      },
      {
        label: "Compensated Trips",
        value: `${stats.compensatedTrips} / ${stats.totalTrips} ${tripsPercent}`,
      },
    ];

    setStats(_stats);
  }

  async function getUserWalletAddress(): Promise<string | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any;

    if (!ethereum) {
      alert("MetaMask is not installed");
      return null;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      console.error("Error getting wallet address:", err);
      return null;
    }
  }

  async function handleClaim(tripId: string) {
    let walletAddress;
    if (!userWallet) {
      walletAddress = await getUserWalletAddress();
      if (!walletAddress) return;
      setUserWallet(walletAddress);
    } else {
      walletAddress = userWallet;
    }
    try {
      console.log(tripId);
      if (walletAddress) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/claim`,
          {
            tripId,
            userAddress: walletAddress,
          }
        );
      }
      alert("Claim successful!");
      setProofs((prev) =>
        prev.map((p) => (p.tripId === tripId ? { ...p, status: "CLAIMED" } : p))
      );
    } catch (err) {
      console.error("Claim failed:", err);
      alert("Claim failed.");
    }
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/users/` +
            localStorage.getItem("userId")
        );
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    async function fetchUserStats() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/stats/` +
            localStorage.getItem("userId")
        );
        handleStats(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
    fetchUserStats();
  }, []);

  useEffect(() => {
    async function fetchProofs() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/compensation/user-proofs/` +
            localStorage.getItem("userId")
        );
        setProofs(res.data);
      } catch (error) {
        console.error("Failed to fetch proofs:", error);
      }
    }

    fetchProofs();
  }, []);

  async function fetchProofsTrips() {
    if (proofsTrips.length !== 0) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/trips/multiple`,
        { ids: proofs.map((p) => p.tripId) }
      );
      setProofsTrips(res.data);
    } catch (error) {
      console.error("Failed to fetch trips for proofs:", error);
    }
  }

  function handleShowProofs(): void {
    setOpenModal(true);
    fetchProofsTrips();
  }

  if (!user) return;

  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="text"
        component={Link}
        href={`/profile/settings`}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          minWidth: 0,
          width: 48,
          height: 48,
          padding: 0,
          borderRadius: "50%",
          borderWidth: 2,
          color: theme.palette.text.primary,
        }}
      >
        <SettingsIcon />
      </Button>

      <Container maxWidth="sm" sx={{ pt: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            src="/profile.png"
            alt="Profile Picture"
            sx={{
              width: 120,
              height: 120,
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: 3,
            }}
          />
        </Box>

        <Typography
          variant="h5"
          fontWeight={500}
          color="text.primary"
          sx={{ mb: 2, ml: 1 }}
        >
          Hi, {user.name}!
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ display: "flex", flexWrap: "wrap", mt: 0 }}
        >
          {stats &&
            stats.map((stat) => (
              <Grid
                item
                xs={6}
                sm={3}
                key={stat.label}
                sx={{ flexGrow: 1 }}
                component="div"
                {...({} as GridProps)}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    padding: 2,
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<FactCheckIcon />}
            onClick={() => handleShowProofs()}
          >
            Show Proofs of Compensation
          </Button>
        </Box>

        {/* Modal */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>🌱 Proofs of Compensation</DialogTitle>
          <DialogContent dividers>
            {proofs.length === 0 ? (
              <Typography>No compensation records found.</Typography>
            ) : (
              proofs.map((proof, idx) => (
                <Box key={proof.tripId} sx={{ mb: 3 }}>
                  <NextLink href={`/trips/${proof.tripId}`} passHref>
                    <MuiLink
                      variant="subtitle1"
                      fontWeight={600}
                      underline="none"
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {proofsTrips &&
                      proofsTrips.find((t) => t.id === proof.tripId)
                        ? proofsTrips.find((t) => t.id === proof.tripId)?.title
                        : `Trip ID: ${proof.tripId}`}
                    </MuiLink>
                  </NextLink>
                  <Typography variant="body1">
                    🌳 Trees Donated: <strong>{proof.trees}</strong>
                  </Typography>
                  <Typography variant="body1">
                    🤝 Volunteer Hours: <strong>{proof.volunteerHours}</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                    color="text.secondary"
                  >
                    💬 {proof.comment}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                  >
                    {proof.status === "CLAIMED" ? (
                      <Typography
                        variant="caption"
                        sx={{ color: "success.main", fontWeight: 600 }}
                      >
                        Claimed
                      </Typography>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleClaim(proof.tripId)}
                      >
                        Claim
                      </Button>
                    )}
                  </Box>

                  {idx < proofs.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
                </Box>
              ))
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
