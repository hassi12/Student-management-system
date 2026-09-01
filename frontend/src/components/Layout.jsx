
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileQuestion,
  MapPin,
  Bell,
  Mail,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

import { NavLink, Outlet } from "react-router-dom";

function Layout() {
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

          <NavItem
            to="/"
            icon={<LayoutDashboard />}
            text="Dashboard"
          />

          <NavItem
            to="/courses"
            icon={<BookOpen />}
            text="My Courses"
          />

          <NavItem
            to="/assignments"
            icon={<ClipboardList />}
            text="Assignments"
          />

          <NavItem
            to="/quizzes"
            icon={<FileQuestion />}
            text="Quizzes"
          />

          <NavItem
            to="/attendance"
            icon={<MapPin />}
            text="Attendance"
          />
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

            <h1>Welcome, Hasnan Amin</h1>

            <p>
              Email: hasnan@bscsportal.edu.pk
            </p>

          </div>


          <div className="header-right">

            <button className="header-icon">
              <Mail />
            </button>

            <button className="header-icon">
              <MessageSquare />
            </button>

            <button className="header-icon notification">
              <Bell />

              <span>3</span>

            </button>


            <div className="profile">

              <div className="profile-circle">
                H
              </div>

              <strong>Hasnan Amin</strong>

              <ChevronDown size={18} />

            </div>

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
