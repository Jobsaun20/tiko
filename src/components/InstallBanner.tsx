import { usePWAInstall } from "@/contexts/PWAInstallContext";
import { useLanguage } from "@/contexts/LanguageContext";  // <--- Importa el hook
import { useState } from "react";

export function InstallBanner() {
  const { canInstall, promptInstall } = usePWAInstall();
  const { t } = useLanguage(); // <--- Obtén las traducciones
  const [closed, setClosed] = useState(false);

  if (!canInstall || closed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#133bb3] text-white rounded-xl shadow-lg flex items-center px-4 py-3 z-50 gap-3">
      <span className="text-lg">{t.banner.title}</span>
      <button
        onClick={promptInstall}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-3 py-1 ml-2 transition"
      >
        {t.banner.install}
      </button>
      <button
        onClick={() => setClosed(true)}
        className="ml-2 text-white text-2xl leading-none hover:opacity-60"
        title={t.banner.close}
        aria-label={t.banner.close}
      >
        ×
      </button>
    </div>
  );
}
