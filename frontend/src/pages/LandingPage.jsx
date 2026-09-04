import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-content" aria-labelledby="landing-title">
        <p className="landing-owner">Adan Ruiz</p>
        <h1 id="landing-title">Cybersecurity Service Desk Simulator</h1>
        <p className="landing-label">Personal Full Stack Cybersecurity Project</p>
        <p className="landing-description">
          A personal full stack cybersecurity project built to simulate
          enterprise security request management and security operations
          workflows.
        </p>
        <Link className="primary-button landing-button" to="/dashboard">
          Enter Service Desk
        </Link>
        <p className="landing-tech">React, FastAPI, PostgreSQL, Vercel, Render</p>
      </section>
    </main>
  );
}

export default LandingPage;
