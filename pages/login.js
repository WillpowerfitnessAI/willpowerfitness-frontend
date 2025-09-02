// pages/login.js
import Login from "../components/Login";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <Login />
        <p className="mt-3 text-center text-xs text-neutral-500">
          We’ll use your email to get you set up.
        </p>
      </div>
    </main>
  );
}
