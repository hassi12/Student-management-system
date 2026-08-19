import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Quizzes from "./pages/Quizzes";
import Attendance from "./pages/Attendance";

function App() {
  return (
    <Routes>

      {/* Login page - without sidebar */}
      <Route path="/login" element={<Login />} />

      {/* Main application */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/attendance" element={<Attendance />} />
      </Route>

    </Routes>
  );
}

export default App;