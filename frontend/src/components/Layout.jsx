
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileQuestion,
  MapPin,
  Bell,
  Mail,
  MessageSquare,
  LogOut,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const isTeacher = role === "teacher";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        {/* LOGO */}
        <div className="logo-area">
          <div className="logo-circle">B</div>
          <h2>BSCS Portal</h2>
        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          {/* DASHBOARD */}
          <NavItem
            to="/"
            icon={<LayoutDashboard />}
            text="Dashboard"
          />

          {/* COURSES */}
          <NavItem
            to="/courses"
            icon={<BookOpen />}
            text={isTeacher ? "My Courses" : "My Courses"}
          />

          {/* ASSIGNMENTS */}
          <NavItem
            to="/assignments"
            icon={<ClipboardList />}
            text={isTeacher ? "Manage Assignments" : "Assignments"}
          />

{/* QUIZZES */}

<NavItem
  to={isTeacher ? "/teacher/quizzes" : "/quizzes"}
  icon={<FileQuestion />}
  text={isTeacher ? "Manage Quizzes" : "Quizzes"}
/>


          {/* ATTENDANCE */}
          <NavItem
            to="/attendance"
            icon={<MapPin />}
            text={isTeacher ? "Manage Attendance" : "Attendance"}
          />

          {/* BOOKS */}
          <NavItem
            to="/books"
            icon={<BookOpen />}
            text="Books"
          />

        </nav>

      </aside>

      {/* MAIN AREA */}
      <main className="main">

        {/* TOP HEADER */}
        <header className="top-header">

          <div className="welcome">

            <h1>
              Welcome, {username || "User"}
            </h1>

            <p>
              {isTeacher
                ? "Teacher Portal"
                : "Student Portal"}
            </p>

          </div>

          <div className="header-right">

            {/* MAIL */}
            <button className="header-icon">
              <Mail />
            </button>

            {/* MESSAGES */}
            <button className="header-icon">
              <MessageSquare />
            </button>

            {/* NOTIFICATIONS */}
            <button className="header-icon notification">
              <Bell />
              <span>3</span>
            </button>

            {/* PROFILE / LOGOUT */}
            <button
              className="profile"
              onClick={handleLogout}
              title="Logout"
            >

              <div className="profile-circle">
                {(username || "U").charAt(0).toUpperCase()}
              </div>

              <strong>
                {username || "User"}
              </strong>

              <LogOut size={18} />

            </button>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className="page-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
}


/* NAVIGATION ITEM */
function NavItem({ to, icon, text }) {

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? "active" : ""}`
      }
    >

      {icon}

      <span>{text}</span>

    </NavLink>
  );
}


export default Layout;
