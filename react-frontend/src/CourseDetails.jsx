import { useCallback, useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Paper, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { UserContext } from "./context/UserContext";
import { api } from "./lib/api";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const isTeacher = user.role === "Teacher";
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await api(`/api/course/${courseId}`); setCourse(data.course); setStudents(data.enrolledStudents || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [courseId]);
  useEffect(() => { load(); }, [load]);

  async function enroll() {
    setBusy(true); setError(""); setMessage("");
    try { const data = await api(`/api/course/${courseId}/enroll`, { method: "POST" }); setMessage(data.message); await load(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setError("");
    try { await api(`/api/course/${courseId}`, { method: "DELETE" }); navigate("/courses", { replace: true }); }
    catch (e) { setConfirm(false); setError(e.message); }
    finally { setBusy(false); }
  }

  const canEnroll = course && !isTeacher && !course.isEnrolled && course.status === "Open" && course.availableSeats > 0;
  return (
    <Stack spacing={3}>
      <Box><Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>Back</Button></Box>
      {loading ? <Box textAlign="center" py={8}><CircularProgress /></Box> : !course ? <Alert severity="error">{error || "Course not found"}</Alert> : <>
        {error && <Alert severity="error">{error}</Alert>}{message && <Alert severity="success">{message}</Alert>}
        <Paper className="detail-hero" elevation={0}>
          <Stack spacing={1.8}>
            <Chip label={course.status} color={course.status === "Open" ? "success" : course.status === "Close" ? "warning" : "error"} sx={{ alignSelf: "flex-start" }} />
            <Typography variant="h3" fontWeight={850} sx={{ letterSpacing: "-.04em" }}>{course.name}</Typography>
            <Typography color="text.secondary">Created by {course.teacherName}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{course.topics.map((topic) => <Chip key={topic} label={topic} className="topic-chip" />)}</Stack>
          </Stack>
        </Paper>
        <Box className="detail-grid">
          <Paper className="detail-pane" elevation={0}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Course information</Typography>
            <Stack spacing={2.5}>
              <Stat icon={<AccessTimeRoundedIcon />} title="Duration" value={`${course.duration} days`} />
              <Divider /><Stat icon={<PeopleAltRoundedIcon />} title="Enrollment" value={`${course.enrolledCount} of ${course.maxStudent} students`} />
              <Divider /><Stat icon={<EventAvailableRoundedIcon />} title="Available seats" value={`${course.availableSeats} remaining`} />
              <Divider /><Stat icon={<EventAvailableRoundedIcon />} title="Price" value={Number(course.price) === 0 ? "Free" : Number(course.price).toLocaleString()} />
            </Stack>
          </Paper>
          <Paper className="detail-pane" elevation={0}>
            {isTeacher ? <>
              <Typography variant="h6" fontWeight={800}>Course management</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>Only you can edit or delete this course.</Typography>
              <Stack spacing={2}><Button variant="contained" component={RouterLink} to={`/courses/${courseId}/edit`} startIcon={<EditRoundedIcon />}>Edit course</Button><Button color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />} disabled={course.enrolledCount > 0} onClick={() => setConfirm(true)}>Delete course</Button></Stack>
              {course.enrolledCount > 0 && <Alert severity="info" sx={{ mt: 2 }}>Courses with enrolled students cannot be deleted.</Alert>}
            </> : <>
              <Typography variant="h6" fontWeight={800}>Your enrollment</Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>{course.isEnrolled ? "You are already enrolled in this course." : course.status === "Close" ? "This course is closed for enrollment." : course.status === "Cancel" ? "This course has been canceled." : course.availableSeats === 0 ? "All seats are currently filled." : "Ready to join? Reserve your place in this course."}</Typography>
              <Button variant="contained" fullWidth size="large" onClick={enroll} disabled={!canEnroll || busy}>{course.isEnrolled ? "Already enrolled" : busy ? "Enrolling…" : "Enroll now"}</Button>
            </>}
          </Paper>
        </Box>
        {isTeacher && <Paper className="detail-pane" elevation={0}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Enrolled students ({students.length})</Typography>
          {students.length === 0 ? <Typography color="text.secondary">No students have enrolled yet.</Typography> :
            <Stack spacing={1.5}>{students.map((student) => <Stack key={student._id} direction="row" alignItems="center" spacing={2} className="student-row"><Avatar sx={{ bgcolor: "#e4e7ff", color: "#3f47a9" }}>{student.username[0]?.toUpperCase()}</Avatar><Box><Typography fontWeight={700}>{student.username}</Typography><Typography variant="body2" color="text.secondary">{student.email}</Typography></Box></Stack>)}</Stack>}
        </Paper>}
      </>}
      <Dialog open={confirm} onClose={() => !busy && setConfirm(false)}><DialogTitle>Delete course?</DialogTitle><DialogContent><DialogContentText>This permanently deletes “{course?.name}”. This is only allowed if no students are enrolled.</DialogContentText></DialogContent><DialogActions><Button onClick={() => setConfirm(false)} disabled={busy}>Keep course</Button><Button color="error" variant="contained" disabled={busy} onClick={remove}>Delete</Button></DialogActions></Dialog>
    </Stack>
  );
}
function Stat({ icon, title, value }) { return <Stack direction="row" alignItems="center" spacing={2}><Box className="stat-icon">{icon}</Box><Box><Typography variant="body2" color="text.secondary">{title}</Typography><Typography fontWeight={750}>{value}</Typography></Box></Stack>; }
