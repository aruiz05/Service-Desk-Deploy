import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext.jsx";

function AdminLogin() {
  const navigate = useNavigate();
  const { isAdmin, signIn, signOut } = useAdminAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      await signIn(formData);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAdmin) {
    return (
      <section className="panel form-panel admin-login-panel">
        <div>
          <p className="panel-label">Admin</p>
          <h2>Admin Mode Active</h2>
          <p className="supporting-text">
            Protected seeded demo records can be edited in this browser session.
          </p>
        </div>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={signOut}>
            Log Out
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel form-panel admin-login-panel">
      <div>
        <p className="panel-label">Admin</p>
        <h2>Admin Login</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="form-field" htmlFor="admin-username">
            <span>Username</span>
            <input
              id="admin-username"
              name="username"
              autoComplete="username"
              required
              value={formData.username}
              onChange={updateField}
            />
          </label>

          <label className="form-field" htmlFor="admin-password">
            <span>Password</span>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={updateField}
            />
          </label>
        </div>

        {error ? <div className="form-error">{error}</div> : null}

        <div className="button-row">
          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminLogin;
