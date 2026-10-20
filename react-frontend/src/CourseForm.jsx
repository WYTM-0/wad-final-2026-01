import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { api } from "./lib/api";
const initial = { name: "", duration: "", topics: "", price: "", maxStudent: "", status: "Open" };
export default function CourseForm() {
  const { courseId } = useParams();
  const editing = !!courseId;
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(0);
  useEffect(() => {
    if (!courseId) return;
    let active = true;
    api(`/api/course/${courseId}`).then(({ course }) => {
      if (active) {
        setForm({ name: course.name, duration: String(course.duration), topics: course.topics.join(", "), price: String(course.price), maxStudent: String(course.maxStudent), status: course.status });
        setEnrolled(course.enrolledCount);
      }
    }).catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [courseId]);
  const change = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    const body = { ...form, duration: Number(form.duration), price: Number(form.price), maxStudent: Number(form.maxStudent), topics: form.topics.split(",").map((v) => v.trim()).filter(Boolean) };
    try {
      const result = await api(editing ? `/api/course/${courseId}` : "/api/course", { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
      navigate(`/courses/${editing ? courseId : result.id}`, { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return (
    <Stack spacing={3} maxWidth={850} mx="auto">
      <Box><Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(editing ? `/courses/${courseId}` : "/courses")}>Back</Button><Typography variant="h4" fontWeight={850} sx={{ mt: 1 }}>{editing ? "Edit course" : "Create a course"}</Typography><Typography color="text.secondary">Set up the course information and enrollment rules.</Typography></Box>
      {loading ? <Box textAlign="center" py={7}><CircularProgress /></Box> : <Paper className="form-card" elevation={0}>
        <Stack component="form" spacing={3} onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Course name" value={form.name} onChange={change("name")} required fullWidth inputProps={{ maxLength: 150 }} />
          <TextField label="Topics (comma separated)" value={form.topics} onChange={change("topics")} required fullWidth multiline minRows={2} helperText="Example: JavaScript, React, MongoDB" />
          <Box className="form-grid">
            <TextField label="Duration (days)" type="number" value={form.duration} onChange={change("duration")} required inputProps={{ min: 1, step: 1 }} fullWidth />
            <TextField label="Price" type="number" value={form.price} onChange={change("price")} required inputProps={{ min: 0, step: ".01" }} fullWidth />
            <TextField label="Max Student" type="number" value={form.maxStudent} onChange={change("maxStudent")} required inputProps={{ min: Math.max(1, enrolled), step: 1 }} fullWidth helperText={editing ? `${enrolled} students enrolled` : "Maximum number of seats"} />
            <FormControl fullWidth><InputLabel id="course-status-label">Status</InputLabel><Select labelId="course-status-label" label="Status" value={form.status} onChange={change("status")}><MenuItem value="Open">Open</MenuItem><MenuItem value="Close">Close</MenuItem><MenuItem value="Cancel">Cancel</MenuItem></Select></FormControl>
          </Box>
          <Alert severity="info">Open accepts new students while seats remain. Close remains visible but cannot accept enrollment. Cancel hides the course from discovery.</Alert>
          <Stack direction="row" justifyContent="flex-end" spacing={1.5}><Button onClick={() => navigate(editing ? `/courses/${courseId}` : "/courses")}>Cancel</Button><Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create course"}</Button></Stack>
        </Stack>
      </Paper>}
    </Stack>
  );
}
