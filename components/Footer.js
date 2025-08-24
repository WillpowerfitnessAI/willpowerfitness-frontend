// components/Footer.js
export default function Footer() {
  return (
    <footer style={{marginTop:'4rem', padding:'2rem 0', textAlign:'center', opacity:.7}}>
      <div style={{fontSize:12}}>
        <a href="/terms" style={{marginRight:12}}>Terms</a>
        <a href="/privacy" style={{marginRight:12}}>Privacy</a>
        <a href="/disclaimer">Disclaimer</a>
      </div>
      <div style={{fontSize:12, marginTop:8}}>
        © {new Date().getFullYear()} WillpowerFitnessAI
      </div>
    </footer>
  );
}
