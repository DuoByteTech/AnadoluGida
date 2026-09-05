import logo from "@/assets/anadolugida.png";
import bg from "@/assets/login-bg.png";

import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-top"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center 20%"
      }}
    >
      {/* arka plan overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Glass Card */}
      <div className="relative w-full max-w-sm rounded-2xl backdrop-blur-xl bg-white/18 border border-white/25 shadow-2xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Anadolu Gıda"
            className="h-14 object-contain"
          />
        </div>

        <div className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-white/80 font-medium">
              E-Mail Adresse
            </label>

            <div className="relative mt-1">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />

              <input
                type="email"
                placeholder="mail@seite.de"
                className="w-full rounded-lg border border-white/20 bg-white/20 backdrop-blur-md pl-10 pr-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-white/80 font-medium">
              Passwort
            </label>

            <div className="relative mt-1">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />

              <input
                type="password"
                placeholder="Passwort"
                className="w-full rounded-lg border border-white/20 bg-white/20 backdrop-blur-md pl-10 pr-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Button */}
          <button className="w-full mt-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition">
            Anmelden
          </button>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;