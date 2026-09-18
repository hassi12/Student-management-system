import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Quizzes from "./pages/Quizzes";
import Attendance from "./pages/Attendance";
import Books from "./pages/Books";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AssignmentDetail from "./pages/AssignmentDetail";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>

      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Password reset pages */}
      <Route
        path="/reset-password/:uid/:token/"
        element={<ResetPassword />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Protected application */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/assignments" element={<Assignments />} />

        {/* Assignment detail page */}
        <Route
          path="/assignments/:id"
          element={<AssignmentDetail />}
        />

        <Route path="/quizzes" element={<Quizzes />} />

        <Route path="/attendance" element={<Attendance />} />

        <Route path="/books" element={<Books />} />
      </Route>

    </Routes>
  );
}

export default App;