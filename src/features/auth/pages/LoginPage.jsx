import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/anadolugida.png";
import bg from "@/assets/login-bg.png";

import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("E-Mail und Passwort sind erforderlich.");
      return;
    }

    try {
      setLoading(true);

      await login(form.email, form.password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error.message === "ADMIN_REQUIRED") {
        setError("Dieses Konto besitzt keine Administratorrechte.");
      } else if (error.message === "ACCOUNT_DISABLED") {
        setError("Dieses Konto wurde deaktiviert.");
      } else if (error.message === "Invalid login credentials") {
        setError("E-Mail-Adresse oder Passwort ist falsch.");
      } else {
        setError("Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-top"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center 20%",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative w-full max-w-sm rounded-2xl backdrop-blur-xl bg-white/18 border border-white/25 shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Anadolu Gıda" className="h-14 object-contain" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm text-white/80 font-medium"
            >
              E-Mail Adresse
            </label>

            <div className="relative mt-1">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="mail@seite.de"
                autoComplete="email"
                className="w-full rounded-lg border border-white/20 bg-white/20 backdrop-blur-md pl-10 pr-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm text-white/80 font-medium"
            >
              Passwort
            </label>

            <div className="relative mt-1">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Passwort"
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/20 bg-white/20 backdrop-blur-md pl-10 pr-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-300/30 bg-red-500/20 px-3 py-2 text-sm text-white">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition"
          >
            {loading ? "Anmeldung..." : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
