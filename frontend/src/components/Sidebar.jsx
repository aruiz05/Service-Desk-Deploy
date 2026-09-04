import { NavLink } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const navigationItems = [
  { to: "/", label: "Dashboard" },
  { to: "/tickets", label: "Tickets" },
  { to: "/submit", label: "Submit Request" },
  { to: "/knowledge", label: "Knowledge Base" },
  { to: "/reports", label: "Reports" },
];

function Sidebar() {
  const { isAdmin, signOut } = useAdminAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-kicker">Cybersecurity Awareness</span>
        <span className="brand-name">Service Desk</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-admin">
        {isAdmin ? (
          <>
            <span className="sidebar-admin-status">Admin Mode</span>
            <button className="sidebar-admin-button" type="button" onClick={signOut}>
              Log Out
            </button>
          </>
        ) : (
          <NavLink
            to="/admin/login"
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            Admin Login
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
