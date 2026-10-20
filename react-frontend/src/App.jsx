// Preserve the original HashRouter architecture from the starter repository.
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { CircularProgress, Box } from "@mui/material";
import { UserContext } from "./context/UserContext";
import Home, { Dashboard } from "./Home";
import Login from "./Login";
import CourseList from "./CourseList";
import CourseDetails from "./CourseDetails";
import CourseForm from "./CourseForm";
import MyCourses from "./MyCourses";

function Private({ children, role }) {
  const { user, isInitializing } = useContext(UserContext);
  if (isInitializing) return <Box className="center-screen"><CircularProgress /></Box>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Private><Home /></Private>}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/new" element={<Private role="Teacher"><CourseForm /></Private>} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="courses/:courseId/edit" element={<Private role="Teacher"><CourseForm /></Private>} />
          <Route path="my-courses" element={<Private role="Student"><MyCourses /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
