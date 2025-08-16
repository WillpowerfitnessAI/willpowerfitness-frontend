// pages/_app.js
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--brand-primary', process.env.NEXT_PUBLIC_BRAND_PRIMARY || '#111111');
    document.documentElement.style.setProperty('--brand-accent', process.env.NEXT_PUBLIC_BRAND_ACCENT || '#C0C0C0');
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
        <title>WillpowerFitness AI</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
