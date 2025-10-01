// /components/Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="WillpowerFitness AI" className="h-8 w-8 rounded-full" />
            <span className="font-semibold">WillpowerFitness AI</span>
          </div>
          <a href="/login" className="text-sm text-white/70 hover:text-white">Member Login</a>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-white/60">
          <p>© 2025 Willpowerfitness. All rights reserved.</p>
          <p className="mt-2">
            Disclaimer: Information provided is for educational purposes only and is not medical advice.
            Consult your physician before beginning any exercise or nutrition program.
          </p>
        </div>
      </footer>
    </div>
  );
}
