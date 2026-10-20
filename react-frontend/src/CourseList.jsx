import { useCallback, useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { api } from "./lib/api";
import { UserContext } from "./context/UserContext";
import CourseCard from "./components/CourseCard";

export default function CourseList() {
  const { user } = useContext(UserContext);
  const isTeacher = user.role === "Teacher";
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async (q) => {
    setLoading(true); setError("");
    try { const data = await api(`/api/course${q ? `?q=${encodeURIComponent(q)}` : ""}`); setCourses(data.courses); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = setTimeout(() => { load(query.trim()); }, 200); return () => clearTimeout(timer); }, [query, load]);
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" gap={2}>
        <Box><Typography variant="h4" fontWeight={850}>{isTeacher ? "My courses" : "Explore courses"}</Typography>
          <Typography color="text.secondary" sx={{ mt: .75 }}>{isTeacher ? "Your courses and student enrollment at a glance." : "Find your next learning opportunity."}</Typography></Box>
        {isTeacher && <Button variant="contained" component={RouterLink} to="/courses/new" startIcon={<AddRoundedIcon />}>Create course</Button>}
      </Stack>
      <TextField fullWidth value={query} onChange={(e) => setQuery(e.target.value)} label="Search courses" placeholder="Search by course name or teacher name…"
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment> } }} />
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? <Box textAlign="center" py={7}><CircularProgress /></Box>
        : courses.length === 0 ? <Box className="empty-state"><MenuBookRoundedIcon color="disabled" sx={{ fontSize: 52 }} /><Typography variant="h6">No courses found</Typography><Typography color="text.secondary">{isTeacher ? "Create your first course to get started." : "Try a different course or teacher name."}</Typography></Box>
        : <Box className="course-grid">{courses.map((course) => <CourseCard key={course._id} course={course} teacher={isTeacher} />)}</Box>}
    </Stack>
  );
}
