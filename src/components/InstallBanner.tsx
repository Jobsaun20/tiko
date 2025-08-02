import { usePWAInstall } from "@/contexts/PWAInstallContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

// Detecta Safari (iOS o macOS)
function isSafari() {
  const ua = window.navigator.userAgent;
  return /safari/i.test(ua) && !/chrome|android/i.test(ua);
}

// Detecta si la app está instalada
function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}


export function InstallBanner() {
  const { canInstall, promptInstall } = usePWAInstall();
  const { t } = useLanguage();
  const [closed, setClosed] = useState(false);
  const [installed, setInstalled] = useState(isAppInstalled());

  // Escuchar cambios de instalación
  useEffect(() => {
    const handler = () => setInstalled(isAppInstalled());
    window.addEventListener("appinstalled", handler);
    // Algunos navegadores iOS no lanzan "appinstalled", por lo que también se puede comprobar al renderizar
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  if (installed || closed) return null;

  const showInstructionsOnly = !canInstall && isSafari();

  if (!canInstall && !showInstructionsOnly) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#52AEB9] text-white rounded-xl shadow-lg px-6 py-5 z-50 w-[320px] max-w-xs">
      <button
        onClick={() => setClosed(true)}
        className="absolute top-2 right-3 text-white text-2xl leading-none hover:opacity-60"
        title={t.banner.close}
        aria-label={t.banner.close}
      >
        ×
      </button>
      <div className="flex flex-col items-center text-center gap-3">
        <span className="text-lg font-medium">{t.banner.title}</span>
        {canInstall ? (
          <button
            onClick={promptInstall}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-6 py-2 mt-2 mb-2 text-base transition shadow"
          >
            {t.banner.install}
          </button>
        ) : (
          <div className="text-white text-base py-2 px-3 rounded-lg bg-[#00000033]">
            {t.banner.showInstallBanner ||
              "En Safari: pulsa el icono de compartir (⬆️) y elige 'Añadir a pantalla de inicio'."}
          </div>
        )}
        <span className="text-xs text-white/80">{t.banner.showInstallBanner}</span>
      </div>
    </div>
  );
}
