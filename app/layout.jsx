export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body style={{ fontFamily: 'sans-serif', padding: '2rem', backgroundColor: '#000', color: '#fff' }}>{children}</body>
    </html>
  );
}
