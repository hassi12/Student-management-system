
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
import AssignmentSubmissions from "./pages/AssignmentSubmissions";
import SubmissionDetail from "./pages/SubmissionDetail";


function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/* DASHBOARD ROUTER */

function RoleDashboard() {

  const role = localStorage.getItem("role");

  if (role === "teacher") {

    return (
      <div>
        <h2>Teacher Dashboard</h2>

        <p>
          Welcome to the BSCS Portal Teacher Dashboard.
        </p>
      </div>
    );

  }

  return <Dashboard />;
}


function App() {

  return (

    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />


      {/* PASSWORD RESET */}
      <Route
        path="/reset-password/:uid/:token/"
        element={<ResetPassword />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* TEACHER ASSIGNMENT PAGES */}

      <Route
        path="/assignments/:id/submissions"
        element={
          <ProtectedRoute>
            <AssignmentSubmissions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assignments/:id/submissions/:submissionId"
        element={
          <ProtectedRoute>
            <SubmissionDetail />
          </ProtectedRoute>
        }
      />


      {/* PROTECTED APPLICATION */}

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        {/* DASHBOARD */}

        <Route
          path="/"
          element={<RoleDashboard />}
        />


        {/* COURSES */}

        <Route
          path="/courses"
          element={<Courses />}
        />


        {/* ASSIGNMENTS */}

        <Route
          path="/assignments"
          element={<Assignments />}
        />

        <Route
          path="/assignments/:id"
          element={<AssignmentDetail />}
        />


        {/* QUIZZES */}

        <Route
          path="/quizzes"
          element={<Quizzes />}
        />


        {/* ATTENDANCE */}

        <Route
          path="/attendance"
          element={<Attendance />}
        />


        {/* BOOKS */}

        <Route
          path="/books"
          element={<Books />}
        />

      </Route>

    </Routes>

  );
}


export default App;
