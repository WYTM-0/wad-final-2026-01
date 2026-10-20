import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { api } from "./lib/api";
import CourseCard from "./components/CourseCard";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/api/course/enrolled").then(({ courses }) => { if (active) setCourses(courses); })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return (
    <Stack spacing={3}>
      <Box><Typography variant="h4" fontWeight={850}>My enrollments</Typography><Typography color="text.secondary" sx={{ mt: .75 }}>All courses you have joined, including any later canceled by their teacher.</Typography></Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? <Box py={8} textAlign="center"><CircularProgress /></Box>
        : courses.length ? <Box className="course-grid">{courses.map((course) => <CourseCard key={course._id} course={course} />)}</Box>
          : <Box className="empty-state"><Typography variant="h6">No enrollments yet</Typography><Typography color="text.secondary">Explore Open courses to join your first class.</Typography></Box>}
    </Stack>
  );
}
