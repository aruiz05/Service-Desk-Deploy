import { useAdminAuth } from "../context/AdminAuthContext.jsx";

function Header({ pageTitle }) {
  const { isAdmin, signOut } = useAdminAuth();

  return (
    <header className="top-header">
      <div>
        <p className="header-kicker">Cybersecurity Awareness Service Desk</p>
        <h1>{pageTitle}</h1>
      </div>
      {isAdmin ? (
        <div className="admin-header-controls">
          <span className="admin-mode-pill">Admin Mode</span>
          <button className="secondary-button" type="button" onClick={signOut}>
            Log Out
          </button>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
