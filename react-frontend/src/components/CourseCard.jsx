import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const statusColors = { Open: "success", Close: "warning", Cancel: "error" };
export default function CourseCard({ course, teacher = false }) {
  return (
    <Paper elevation={0} className="course-card">
      <Stack spacing={1.6} height="100%">
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Chip size="small" label={course.status} color={statusColors[course.status] || "default"} variant="outlined" />
          {course.isEnrolled && <Chip size="small" label="Enrolled" color="primary" />}
        </Stack>
        <Box>
          <Typography variant="h6" fontWeight={800} className="course-name">{course.name}</Typography>
          <Typography variant="body2" color="text.secondary">by {course.teacherName}</Typography>
        </Box>
        <Stack direction="row" spacing={.5} flexWrap="wrap" useFlexGap>
          {course.topics?.slice(0, 3).map((topic) => <Chip key={topic} label={topic} size="small" className="topic-chip" />)}
          {(course.topics?.length || 0) > 3 && <Chip label={`+${course.topics.length - 3}`} size="small" className="topic-chip" />}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ color: "text.secondary" }}>
          <Typography variant="caption" display="flex" alignItems="center" gap={.5}><AccessTimeRoundedIcon fontSize="small" /> {course.duration} days</Typography>
          <Typography variant="caption" display="flex" alignItems="center" gap={.5}><PeopleAltRoundedIcon fontSize="small" /> {course.enrolledCount}/{course.maxStudent} students</Typography>
        </Stack>
        <Box flexGrow={1} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Box><Typography fontSize={24} fontWeight={850}>{Number(course.price) === 0 ? "Free" : Number(course.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography><Typography variant="caption" color="text.secondary">{teacher ? "Course price" : `${course.availableSeats} seats remaining`}</Typography></Box>
          <Button component={RouterLink} to={`/courses/${course._id}`} endIcon={<ArrowForwardRoundedIcon />} variant="outlined">Details</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
