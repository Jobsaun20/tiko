import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ArrowLeft } from "lucide-react";
import Lottie from "lottie-react";

export default function Onboarding() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState<any>(null);

  // URLs de animaciones
  const slides = [
    {
      lottie: "https://lottie.host/b7826704-df29-4a8b-a785-6f10c66c9468/YShWMObADu.json",
      title: t.onboard.whatIsDeswg,
      desc: t.onboard.whatIsDeswgDescription,
    },
    {
      lottie: "https://lottie.host/a9b25b68-7a1d-4f4f-be12-60dfc31814d8/b3dGcYKY5h.json",
      title: t.onboard.createGroups,
      desc: t.onboard.createGroupsDescription,
    },
    {
      lottie: "https://lottie.host/68a2a483-296d-499a-ba74-7e2e160b773a/zoQM2W5Vmj.json",
      title: t.onboard.payAndLevelUp,
      desc: t.onboard.payAndLevelUpDescription,
    },
  ];

  // Cargar animación online cada vez que cambie el slide
  useEffect(() => {
    setAnimationData(null); // Limpia antes de cargar
    fetch(slides[step].lottie)
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, [step]);

  const next = () => setStep((s) => Math.min(slides.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#52AEB9] relative">
      {/* Flecha arriba a la izquierda */}
      <button
        className="absolute top-5 left-5 z-50 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
        onClick={() => navigate("/welcome")}
        aria-label="Volver"
        type="button"
      >
        <ArrowLeft className="w-6 h-6 text-[#52AEB9]" />
      </button>
      {/* Language Selector arriba a la derecha */}
      <div className="absolute top-5 right-5 z-50">
        <LanguageSelector />
      </div>
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 max-w-md w-full flex flex-col items-center relative">
        {/* Step indicator */}
        <div className="absolute top-5 right-5 flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${i === step ? "bg-[#52AEB9]" : "bg-yellow-300"} transition`}
            />
          ))}
        </div>
        {/* Animación Lottie */}
        <div className="w-32 h-32 rounded-xl overflow-hidden mb-6 bg-[#f3f3f3] flex items-center justify-center shadow">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">...</div>
          )}
        </div>
        {/* Texto */}
        <h2 className="text-2xl font-bold text-[#52AEB9] mb-2 text-center">{slides[step].title}</h2>
        <p className="text-gray-700 mb-6 text-center">{slides[step].desc}</p>
        {/* Botones */}
        <div className="flex w-full gap-2 mt-2">
          {step > 0 && (
            <button
              className="flex-1 py-2 rounded-xl bg-gray-100 text-[#52AEB9] font-semibold shadow hover:bg-gray-200"
              onClick={prev}
            >
              {t.onboard.back}
            </button>
          )}
          {step < slides.length - 1 ? (
            <button
              className="flex-1 py-2 rounded-xl bg-[#52AEB9] text-white font-semibold shadow hover:bg-[#418893]"
              onClick={next}
            >
              {t.onboard.next}
            </button>
          ) : (
            <button
              className="flex-1 py-2 rounded-xl bg-yellow-400 text-black font-semibold shadow hover:bg-yellow-500"
              onClick={() => navigate("/register")}
            >
              {t.onboard.createAccount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
