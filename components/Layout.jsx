// components/Layout.jsx
export default function Layout({ children }) {
  return (
    <>
      <header className="container" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Logo → home */}
        <a
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          aria-label="WillpowerFitness AI — home"
        >
          <img src="/logo.png" alt="WillpowerFitness AI" width={42} height={42} />
          <strong>WillpowerFitness AI</strong>
        </a>

        {/* Right side actions */}
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <a href="/login" className="btn btn-outline">Login</a>
          {/* Start Trial = pre-checkout form with trial param */}
          <a href="/join?trial=2" className="btn btn-primary">Start Trial</a>
        </nav>
      </header>

      <main className="container">{children}</main>

      <footer className="container" style={{ opacity: 0.7, paddingBottom: 32 }}>
        <small>© {new Date().getFullYear()} WillpowerFitness. All rights reserved. This is not medical advice.</small>
      </footer>
    </>
  );
}

