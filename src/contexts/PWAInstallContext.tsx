import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PWAInstallContextProps {
  canInstall: boolean;
  promptInstall: () => void;
}

// ¡ESTO ES LO QUE TE FALTABA!
const PWAInstallContext = createContext<PWAInstallContextProps>({
  canInstall: false,
  promptInstall: () => {},
});

export const usePWAInstall = () => useContext(PWAInstallContext);

export const PWAInstallProvider = ({ children }: { children: ReactNode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setCanInstall(false);
      });
    }
  };

  return (
    <PWAInstallContext.Provider value={{ canInstall, promptInstall }}>
      {children}
    </PWAInstallContext.Provider>
  );
};
