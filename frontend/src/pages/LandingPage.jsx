import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-shell" aria-labelledby="landing-title">
        <div className="landing-terminal-bar" aria-hidden="true">
          <span className="landing-status-light" />
          <span>SYSTEM STATUS: ONLINE</span>
        </div>

        <div className="landing-content">
          <p className="landing-owner">Adan Ruiz</p>
          <p className="landing-console-label">SECURITY OPERATIONS CONSOLE</p>
          <h1 className="landing-project-title" id="landing-title">
            Cybersecurity Service Desk Simulator
          </h1>
          <p className="landing-label">
            Personal Full Stack Cybersecurity Project
          </p>
          <p className="landing-description">
            A personal full stack cybersecurity project built to simulate
            enterprise security request management and security operations
            workflows.
          </p>
          <Link className="landing-enter-button" to="/dashboard">
            [ ENTER SERVICE DESK ]
          </Link>
          <p className="landing-tech">
            React | FastAPI | PostgreSQL | Vercel | Render
          </p>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
