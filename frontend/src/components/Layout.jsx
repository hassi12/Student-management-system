import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileQuestion,
  MapPin,
  Library,
  StickyNote,
  MessageSquare,
  Megaphone,
  CalendarDays,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>BSCS Portal</h2>

        <nav>
          <NavItem to="/" icon={<LayoutDashboard />} text="Dashboard" />
          <NavItem to="/courses" icon={<BookOpen />} text="My Courses" />
          <NavItem to="/assignments" icon={<ClipboardList />} text="Assignments" />
          <NavItem to="/quizzes" icon={<FileQuestion />} text="Quizzes" />
          <NavItem to="/attendance" icon={<MapPin />} text="Attendance" />
          <NavItem to="/books" icon={<Library />} text="Books" />
          <NavItem to="/notes" icon={<StickyNote />} text="Notes" />
          <NavItem to="/messages" icon={<MessageSquare />} text="Messages" />
          <NavItem to="/announcements" icon={<Megaphone />} text="Announcements" />
          <NavItem to="/calendar" icon={<CalendarDays />} text="Calendar" />
        </nav>

        <div className="sidebar-bottom">
          <NavItem to="/profile" icon={<User />} text="Profile" />
          <NavItem to="/settings" icon={<Settings />} text="Settings" />
          <NavItem to="/logout" icon={<LogOut />} text="Logout" />
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

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