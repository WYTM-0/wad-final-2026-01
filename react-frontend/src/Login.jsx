import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { UserContext } from "./context/UserContext";
import { api } from "./lib/api";

export default function Login() {
  const { user, isInitializing, login, loginErrorMsg } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (isInitializing) return <Box className="center-screen"><CircularProgress /></Box>;
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      if (register) {
        await api("/api/user", { method: "POST", body: JSON.stringify({ username, email, password }) });
        setMessage("Student account created. Sign in below."); setRegister(false); setPassword("");
      } else {
        const ok = await login(email, password);
        if (ok) navigate("/", { replace: true });
      }
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return (
    <Box className="login-page">
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <Box className="login-brand-icon"><SchoolRoundedIcon fontSize="large" /></Box>
          <Typography variant="h4" fontWeight={900} letterSpacing="-.05em">CourseSpace</Typography>
          <Typography color="text.secondary" textAlign="center">Online Course Service</Typography>
        </Stack>
        <Paper className="login-card" elevation={0}>
          <Typography variant="h5" fontWeight={850}>{register ? "Join as a student" : "Welcome back"}</Typography>
          <Typography color="text.secondary" sx={{ mt: .5, mb: 3 }}>{register ? "Create your student account to enroll." : "Sign in to access your learning workspace."}</Typography>
          <Stack component="form" spacing={2.5} onSubmit={submit}>
            {register && <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required inputProps={{ minLength: 3, maxLength: 40 }} />}
            <TextField fullWidth autoComplete="username" label={register ? "Email address" : "Email or username"} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" autoComplete={register ? "new-password" : "current-password"}
              type={visible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setVisible((v) => !v)} edge="end" aria-label="Toggle password visibility">{visible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}</IconButton></InputAdornment> } }} />
            {(error || loginErrorMsg && !register) && <Alert severity="error">{error || loginErrorMsg}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <Button type="submit" size="large" variant="contained" disabled={busy} sx={{ py: 1.5, borderRadius: 2.5 }}>{busy ? "Please wait…" : register ? "Create student account" : "Sign in"}</Button>
          </Stack>
          <Typography sx={{ mt: 3 }} textAlign="center" color="text.secondary" variant="body2">
            {register ? "Already have an account? " : "New student? "}
            <Link component="button" type="button" underline="hover" onClick={() => { setRegister((v) => !v); setError(""); setMessage(""); }}>
              {register ? "Sign in" : "Register here"}
            </Link>
          </Typography>
        </Paper>
        <Typography textAlign="center" color="text.secondary" variant="caption" display="block" sx={{ mt: 3 }}>Teacher test accounts are created by the MongoDB seed script.</Typography>
      </Container>
    </Box>
  );
}
