import { useContext } from "react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, Chip, Container, Stack, Paper } from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { UserContext } from "./context/UserContext";
import hero from "./assets/hero.png";

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  async function signOut() { await logout(); navigate("/login", { replace: true }); }
  const isTeacher = user.role === "Teacher";
  return (
    <Box className="app-shell">
      <AppBar position="sticky" elevation={0} className="topbar">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: { xs: 1, sm: 2 }, minHeight: 72 }}>
            <Box component={RouterLink} to="/" className="brand">
              <Box className="brand-icon"><SchoolRoundedIcon /></Box>
              <Typography sx={{ fontWeight: 850, letterSpacing: "-.05em", fontSize: { xs: 18, sm: 23 } }}>CourseSpace</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Button className="nav-btn" color="inherit" component={RouterLink} to="/courses">{isTeacher ? "My Courses" : "Explore"}</Button>
            {!isTeacher && <Button className="nav-btn" color="inherit" component={RouterLink} to="/my-courses">Enrolled</Button>}
            {isTeacher && <Button variant="contained" size="small" component={RouterLink} to="/courses/new" className="header-create">+ Create</Button>}
            <Button onClick={signOut} className="nav-btn" color="inherit" startIcon={<LogoutRoundedIcon />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>Logout</Button>
            <Button onClick={signOut} className="logout-mobile" color="inherit" aria-label="Log out"><LogoutRoundedIcon /></Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Box className="footer"><Container maxWidth="lg">CourseSpace · Online Course Service · {user.username} ({user.role})</Container></Box>
    </Box>
  );
}

export function Dashboard() {
  const { user } = useContext(UserContext);
  const isTeacher = user.role === "Teacher";
  return (
    <Stack spacing={3}>
      <Paper elevation={0} className="hero-panel">
        <Box className="hero-copy">
          <Chip label={isTeacher ? "TEACHER PORTAL" : "STUDENT PORTAL"} size="small" className="hero-chip" />
          <Typography variant="h3" className="hero-title">Hello, {user.username}.<br />{isTeacher ? "Build something great." : "Learn something new."}</Typography>
          <Typography className="hero-subtitle">
            {isTeacher ? "Create, publish and manage your own courses. Keep track of enrollment in one place." : "Discover courses from teachers, explore the details and reserve your place."}
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button component={RouterLink} to={isTeacher ? "/courses/new" : "/courses"} variant="contained" endIcon={<ArrowForwardRoundedIcon />} className="hero-cta">
              {isTeacher ? "Create a course" : "Explore courses"}
            </Button>
            <Button component={RouterLink} to={isTeacher ? "/courses" : "/my-courses"} variant="outlined" className="hero-secondary">
              {isTeacher ? "Manage courses" : "My enrollments"}
            </Button>
          </Stack>
        </Box>
        <Box className="hero-visual"><img src={hero} alt="Learning illustration" /></Box>
      </Paper>
      <Box className="section-intro"><Typography variant="h5" fontWeight={800}>Your workspace</Typography><Typography color="text.secondary">Everything you need, all in one place.</Typography></Box>
      <Box className="feature-grid">
        <Paper className="feature-card" component={RouterLink} to="/courses" elevation={0}>
          <Box className="feature-icon purple"><LibraryBooksRoundedIcon /></Box>
          <Typography variant="h6" fontWeight={800}>{isTeacher ? "Manage courses" : "Course catalog"}</Typography>
          <Typography color="text.secondary" variant="body2">{isTeacher ? "Review your classes, student counts and course status." : "Search by course or teacher and see available seats."}</Typography>
          <Typography className="feature-link">Open <ArrowForwardRoundedIcon fontSize="small" /></Typography>
        </Paper>
        <Paper className="feature-card" component={RouterLink} to={isTeacher ? "/courses/new" : "/my-courses"} elevation={0}>
          <Box className="feature-icon aqua">{isTeacher ? <AddCircleRoundedIcon /> : <GroupsRoundedIcon />}</Box>
          <Typography variant="h6" fontWeight={800}>{isTeacher ? "Create a course" : "My learning"}</Typography>
          <Typography color="text.secondary" variant="body2">{isTeacher ? "Choose your topics, duration, capacity, price and status." : "Keep track of every course you have enrolled in."}</Typography>
          <Typography className="feature-link">Open <ArrowForwardRoundedIcon fontSize="small" /></Typography>
        </Paper>
      </Box>
    </Stack>
  );
}
