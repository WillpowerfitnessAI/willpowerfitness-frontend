// components/Layout.jsx
export default function Layout({ children }) {
  return (
    <>
      <header
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 14 }}
      >
        {/* Logo + brand link to home */}
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          aria-label="WillpowerFitness AI—home"
        >
          <img src="/logo.png" alt="WillpowerFitness AI" width="42" height="42" />
          <strong>WillpowerFitness AI</strong>
        </a>

        {/* Right side actions — Login + Start Trial (no Consultation here) */}
        <nav style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <a href="/login" className="btn btn--outline">Login</a>
          <a href="/subscribe" className="btn btn--primary">Start Trial</a>
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="container" style={{ opacity: 0.7, paddingBottom: 32 }}>
        <small>
          © {new Date().getFullYear()} WillpowerFitness. All rights reserved. This is not medical advice.
        </small>
      </footer>
    </>
  );
}

