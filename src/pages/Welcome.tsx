// src/pages/Welcome.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Welcome() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#52AEB9] relative">
      {/* Selector de idioma en la esquina superior derecha */}
      <div className="absolute top-5 right-5 z-50">
        <LanguageSelector />
      </div>

      {/* Logo Pic grande sin fondo blanco */}
      <div className="mb-8 flex flex-col items-center">
        <img
          src="/img/logowelcome.png"
          alt="Pic logo"
          className="w-32 h-32 object-contain mb-3"
        />
        {/* <h1 className="text-white text-4xl font-bold tracking-tight mb-1">
          Pic
        </h1> */}
        <p className="text-yellow-300 text-lg font-semibold">
          {t.welcome?.subtitle1 || "Fines among friends"}
        </p>
      </div>

      {/* Tarjeta de bienvenida */}
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 max-w-md w-full flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold text-[#52AEB9] text-center">
          {t.welcome?.title || "Welcome to Pic!"}
        </h2>
        <p className="text-gray-700 text-center">
          {t.welcome?.description ||
            "Discover a new way to motivate and have fun!"}
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="w-full py-3 rounded-xl bg-[#52AEB9] text-white font-bold text-lg shadow transition hover:bg-[#418893]"
            onClick={() => navigate("/login")}
          >
            {t.welcome?.login || "Login"}
          </button>
          <button
            className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-lg shadow transition hover:bg-yellow-500"
            onClick={() => navigate("/onboarding")}
          >
            {t.welcome?.newUser || "New user"}
          </button>
        </div>
      </div>
    </div>
  );
}
