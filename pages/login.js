// /pages/login.js
import { useRouter } from "next/router";
import Login from "../components/Login";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email) => {
    console.log("Login email:", email);
    // TODO: replace with real auth; for now go to subscribe (or wherever)
    router.push("/subscribe");
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-md px-4 py-10">
        <Login onLogin={handleLogin} />
        <p className="mt-3 text-center text-xs text-neutral-500">
          We’ll use your email to get you set up.
        </p>
      </div>
    </main>
  );
}
