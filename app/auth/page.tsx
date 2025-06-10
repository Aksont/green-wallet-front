"use client";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import Link from "next/link";
// import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useRouter } from "next/navigation";

function TabPanel(props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ mt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3001/users", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      setSnackbar({
        message: "Successfully registered! Please login.",
        severity: "success",
      });
      setTabIndex(0);
      setRegisterEmail("");
      setRegisterName("");
      setRegisterPassword("");
    } catch (error) {
      console.log(error);
      setSnackbar({ message: "Registration failed.", severity: "error" });
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/users/login", {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem("userId", res.data.id);
      router.push("/profile");
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.log(error);
      setSnackbar({ message: "Login failed.", severity: "error" });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ pt: 10 }}>
      <Button
        variant="text"
        component={Link}
        href="/"
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          minWidth: 0,
          width: 48,
          height: 48,
          padding: 0,
          borderRadius: "50%",
          borderWidth: 2,
        }}
      >
        <ArrowBackIcon />
      </Button>

      <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
        Join the community of Green Tourists
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleChange}
        centered
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          type="email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, borderRadius: "9999px" }}
          onClick={handleLogin}
        >
          Log In
        </Button>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          type="email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, borderRadius: "9999px" }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </TabPanel>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar?.severity || "success"}
          onClose={() => setSnackbar(null)}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
