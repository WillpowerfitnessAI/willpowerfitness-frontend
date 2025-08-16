// components/Layout.jsx
export default function Layout({ children }) {
  return (
    <>
      <header className="container" style={{display:'flex',alignItems:'center',gap:14}}>
        <img src="/logo.png" alt="WillpowerFitness" width="42" height="42" />
        <strong>WillpowerFitness AI</strong>
        <div style={{marginLeft:'auto',display:'flex',gap:12}}>
          <a href="/consultation" className="btn btn--outline">Free Consultation</a>
          <a href="/subscribe" className="btn btn--primary">Start Trial</a>
        </div>
      </header>
      <main className="container">{children}</main>
      <footer className="container" style={{opacity:.7, paddingBottom:32}}>
        <small>© {new Date().getFullYear()} WillpowerFitness. All rights reserved. This is not medical advice.</small>
      </footer>
    </>
  );
}
