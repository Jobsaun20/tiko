import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InstallAppIOS() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#52AEB9]/10">
      <div className="bg-white rounded-2xl shadow-xl px-6 py-8 max-w-md w-full relative flex flex-col">
        {/* Botón X arriba a la derecha */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#52AEB9] transition"
          aria-label={t.common.close || "Cerrar"}
        >
          <X className="w-7 h-7" />
        </button>
        <h2 className="text-2xl font-bold text-[#52AEB9] mb-2 text-center">
          {t.installApp.iosTitle || "Instalar app en iOS"}
        </h2>
        <p className="mb-4 text-gray-600 text-center">
          {t.installApp.iosIntro ||
            "Instala la web como app en tu iPhone o iPad para un acceso más rápido."}
        </p>
        <ol className="list-decimal list-inside space-y-4 text-gray-800">
          <li>
            <b>{t.installApp.iosStep2 || "Pulsa el botón 'Compartir'"}</b>
            <div className="flex justify-center mt-2 mb-2">
              <img
                src="/img/ios-share.png"
                alt="iOS compartir"
                className="h-9 w-9"
                style={{ display: "block" }}
              />
            </div>
            <span className="block text-gray-500 text-sm text-center">
              {t.installApp.iosShareDesc ||
                "Es el icono con un cuadrado y una flecha hacia arriba, en la parte inferior."}
            </span>
          </li>
          <li>
            <b>
              {t.installApp.iosStep3 ||
                "Selecciona 'Añadir a pantalla de inicio'."}
            </b>
          </li>
          <li>
            <b>
              {t.installApp.iosStep4 ||
                "Confirma pulsando 'Añadir' en la esquina superior derecha."}
            </b>
          </li>
          <li>
            <b>
              {t.installApp.iosDone ||
                "¡Listo! Ahora puedes abrir la app directamente desde tu pantalla de inicio."}
            </b>
          </li>
        </ol>
        <div className="flex justify-center mt-6">
          <Button
            className="bg-[#52AEB9] text-white rounded-xl font-bold shadow px-6"
            onClick={() => navigate("/")}
          >
            {t.common.goHome || "Ir al inicio"}
          </Button>
        </div>
      </div>
    </div>
  );
}
