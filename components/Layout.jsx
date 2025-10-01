// components/Layout.jsx
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        {/* Responsive viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f766e" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />

        {/* Basic SEO (optional) */}
        <title>Willpowerfitness AI</title>
        <meta
          name="description"
          content="Elite AI personal training. Precision. Accountability. Results."
        />
      </Head>

      {/* Header */}
      <header className="w-full border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="font-semibold">Willpowerfitness AI</div>
          <a href="/login" className="text-sm opacity-80 hover:opacity-100">
            Member Login
          </a>
        </div>
      </header>

      {/* Page content – full-bleed and responsive paddings */}
      <main className="w-full">{children}</main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 mt-16">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8 text-xs opacity-70">
          © 2025 Willpowerfitness. All rights reserved.{" "}
          <a href="/terms" className="underline">Terms</a> ·{" "}
          <a href="/privacy" className="underline">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
