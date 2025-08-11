import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePWAInstall } from "@/contexts/PWAInstallContext";
import PhoneModal from "@/components/PhoneModal";

/* ===== helpers ===== */
function isSafari() {
  const ua = window.navigator.userAgent;
  return /safari/i.test(ua) && !/chrome|android/i.test(ua);
}
function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}
const splitLines = (s?: string) =>
  (s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
/* ==================== */

type StepId = "contact" | "group" | "rule" | "action" | "phoneShare" | "install";
const STEP_ORDER: StepId[] = ["contact", "group", "rule", "action", "phoneShare", "install"];

export default function IndexTutorialOverlay({
  user,
  profileId,        // <- opcional: pasa profile.id desde Index
  onFinish,
  onOpenShare,      // abre InviteModal / compartir (si lo usas)
}: {
  user: any;
  profileId?: string;
  onFinish: () => void;
  onOpenShare: () => void;
}) {
  const { t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const stepId = STEP_ORDER[stepIndex];

  // modal de teléfono (real)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);

  const next = () => setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  // Guarda el teléfono NORMALIZADO (viene ya normalizado desde PhoneModal)
  const handleSavePhone = async (normalizedPhone: string) => {
    const rowId = profileId || user?.id;
    if (!rowId) {
      alert("No se pudo guardar el teléfono (id no encontrado).");
      return;
    }

    setSavingPhone(true);
    try {
      const { error } = await supabase
        .from("users")                // cambia a "profiles" si tu tabla se llama así
        .update({ phone: normalizedPhone })
        .eq("id", rowId);

      if (error) {
        console.error("Save phone error:", error);
        alert(error.message || "No se pudo guardar el teléfono.");
        return; // no avances si falló
      }

      setPhoneModalOpen(false);
      next(); // tras guardar, avanza a instalar
    } finally {
      setSavingPhone(false);
    }
  };

  const closeTutorial = () => {
    localStorage.setItem(`tutorialDone:${user.id}`, "1");
    onFinish();
    // Refresca la página index al terminar
    window.location.reload();
  };

  const total = STEP_ORDER.length;
  const pct = ((stepIndex + 1) / total) * 100;
  const stepOfTotal =
    (t.tutorial?.progress?.stepOfTotal || "Paso {current} de {total}")
      .replace("{current}", String(stepIndex + 1))
      .replace("{total}", String(total));

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[420px] w-[92vw] p-0 overflow-hidden rounded-3xl border-0 [&>button]:hidden">
        {/* A11y (oculto) */}
        <DialogHeader className="sr-only">
          <DialogTitle>{t.tutorial?.header?.title || "Cómo funciona DESWG"}</DialogTitle>
          <DialogDescription>
            {t.tutorial?.header?.subtitle || "Un vistazo en 6 pasos. Nada se envía fuera."}
          </DialogDescription>
        </DialogHeader>

        {/* Header visible + progreso */}
        <div className="bg-gradient-to-b from-[#EAF6F8] to-[#F7FBFC] px-4 pt-5">
          <div className="max-w-[380px] mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#52AEB9] text-white text-xl shadow-md mb-2">
              🏁
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {t.tutorial?.header?.title || "Cómo funciona DESWG"}
            </h2>
            <p className="text-xs text-slate-600">
              {t.tutorial?.header?.subtitle || "Un vistazo en 6 pasos. Nada se envía fuera."}
            </p>
          </div>

          {/* Progreso */}
          <div className="max-w-[380px] mx-auto mt-3 mb-2">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>{stepOfTotal}</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-[#52AEB9] transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-b from-[#EAF6F8] to-[#F7FBFC]">
          <div className="max-h=[70vh] max-h-[70vh] overflow-y-auto px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div className="max-w-[380px] mx-auto mt-3">
              {stepId === "contact" && (
                <TextCard
                  icon="🧑‍🤝‍🧑"
                  title={t.tutorial?.steps?.contact?.title || "Empieza con un contacto"}
                  lines={[
                    t.tutorial?.steps?.contact?.body ||
                      "Los contactos son con quienes podrás crear grupos, reglas, multas y retos.",
                  ]}
                  note={t.tutorial?.steps?.contact?.note || "Esta prueba no envía nada fuera de la app."}
                />
              )}

              {stepId === "group" && (
                <TextCard
                  icon="👥"
                  title={t.tutorial?.steps?.group?.title || "Crea tu grupo"}
                  subtitle={
                    t.tutorial?.steps?.group?.subtitle ||
                    "En los grupos viven las reglas, la actividad, las multas y los retos."
                  }
                  lines={[
                    t.tutorial?.steps?.group?.body ||
                      "Pon un nombre y, después de crearlo, añade miembros desde tus Contactos o comparte el link/QR para que se unan.",
                  ]}
                  note={
                    t.tutorial?.steps?.group?.note ||
                    "Solo puedes añadir miembros que ya estén en Contactos (o invítalos por link/QR)."
                  }
                />
              )}

              {stepId === "rule" && (
                <TextCard
                  icon="📏"
                  title={t.tutorial?.steps?.rule?.title || "Añade una regla"}
                  subtitle={t.tutorial?.steps?.rule?.subtitle || "Empieza simple para que todos lo entiendan."}
                  lines={splitLines(
                    t.tutorial?.steps?.rule?.examples ||
                      "• “Sacar la basura martes” — CHF 1\n• “Turno de platos” — CHF 1"
                  )}
                  note={t.tutorial?.steps?.rule?.note || "Podrás editar o borrar reglas cuando quieras."}
                />
              )}

              {stepId === "action" && (
                <TextCard
                  icon="⚡️"
                  title={t.tutorial?.steps?.action?.title || "Envía una multa o un reto"}
                  lines={splitLines(
                    t.tutorial?.steps?.action?.tips ||
                      "• Desde la barra: elige el contacto y envía.\n• Desde el grupo: toca su nombre para que la multa cite el grupo/regla que se incumplió.\nLa multa quedará registrada; si está pendiente, la otra persona verá la opción Pagar."
                  )}
                  note={
                    t.tutorial?.steps?.action?.note ||
                    "Para recibir pagos, añade tu +41… en Perfil → Pagos (TWINT)."
                  }
                />
              )}

              {stepId === "phoneShare" && (
                <div className="bg-white/95 backdrop-blur rounded-3xl border border-[#E6F2F4] shadow-[0_8px_24px_rgba(82,174,185,0.15)] p-4 space-y-3">
                  {/* Título con icono 💰 */}
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#F1FBFD] flex items-center justify-center text-lg">
                      <span aria-hidden>💰</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-slate-800 pb-2">
                        {t.tutorial?.steps?.phoneShare?.title || "Activa pagos y comparte la app"}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {t.tutorial?.steps?.phoneShare?.description ||
                          "Para recibir pagos por TWINT, añade tu +41…. Puedes hacerlo ahora o más tarde."}
                      </p>
                    </div>
                  </div>

                  {/* Botón ancho + texto clicable debajo */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => setPhoneModalOpen(true)}
                      style={{ background: "#52AEB9", color: "#fff" }}
                      disabled={savingPhone}
                    >
                      {t.tutorial?.steps?.phoneShare?.addPhone || "Agregar teléfono"}
                    </Button>

                    <button
                      type="button"
                      onClick={next} // omitir = siguiente
                      className="w-full text-center text-[#52AEB9] text-sm font-medium hover:underline"
                    >
                      {t.tutorial?.steps?.phoneShare?.skipNow || "Omitir por ahora"}
                    </button>
                  </div>

                  {/* Compartir (opcional) */}
                  {/* <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={onOpenShare}
                      className="text-[#3C98A4] text-sm font-medium hover:underline"
                    >
                      {t.tutorial?.steps?.phoneShare?.shareApp || "Compartir app / Invitar"}
                    </button>
                  </div> */}
                </div>
              )}

              {stepId === "install" && <InstallCard />}
            </div>
          </div>
        </div>

        {/* Navegación inferior */}
        <div className="bg-white px-4 pb-4 pt-3 border-t">
          <div className="max-w-[380px] mx-auto grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={prev} disabled={stepIndex === 0}>
              {t.tutorial?.nav?.back || "Atrás"}
            </Button>
            {stepIndex < total - 1 ? (
              <Button onClick={next} style={{ background: "#52AEB9", color: "#fff" }}>
                {t.tutorial?.nav?.next || "Siguiente"}
              </Button>
            ) : (
              <Button onClick={closeTutorial}>
                {t.tutorial?.nav?.finish || "Terminar"}
              </Button>
            )}
          </div>
          <div className="max-w-[380px] mx-auto text-center">
            <button
              className="mt-2 text-xs text-slate-500 hover:text-slate-700"
              onClick={closeTutorial}
            >
              {t.tutorial?.nav?.skipTutorial || "Saltar tutorial"}
            </button>
          </div>
        </div>
      </DialogContent>

      {/* Modal de teléfono (real) */}
      <PhoneModal
        isOpen={phoneModalOpen}
        onClose={() => setPhoneModalOpen(false)}
        onSave={handleSavePhone} // guarda y avanza a "install"
      />
    </Dialog>
  );
}

/* -------- Tarjeta de texto básica -------- */
function TextCard({
  title,
  subtitle,
  lines,
  note,
  icon,
}: {
  title: string;
  subtitle?: string;
  lines: string[];
  note?: string;
  icon?: string;
}) {
  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl border border-[#E6F2F4] shadow-[0_8px_24px_rgba(82,174,185,0.15)] p-4">
      <div className="flex items-start gap-2">
        <div className="shrink-0 w-8 h-8 rounded-full bg-[#F1FBFD] flex items-center justify-center text-lg">
          <span aria-hidden>{icon || "•"}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>}
          <div className="text-sm text-slate-700 mt-2 space-y-1">
            {lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
          {note && <p className="text-xs text-slate-500 mt-2">{note}</p>}
        </div>
      </div>
    </div>
  );
}

/* -------- Tarjeta INSTALAR (píldora + caja azul con título centrado) -------- */
function InstallCard() {
  const { canInstall, promptInstall } = usePWAInstall();
  const { t } = useLanguage();
  const [installed, setInstalled] = useState(isAppInstalled());

  useEffect(() => {
    const handler = () => setInstalled(isAppInstalled());
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const showInstructionsOnly = !canInstall && isSafari();

  const title =
    t.tutorial?.steps?.install?.title ||
    t.banner?.title ||
    "Instala la APP";

  const innerTitle =
    t.tutorial?.steps?.install?.title2 ||
    t.tutorial?.steps?.install?.title ||
    "Instala la APP";

  const safariMsg =
    t.tutorial?.steps?.install?.instructionsSafari ||
    t.banner?.showInstallBanner ||
    "En Safari: pulsa el icono de compartir (⬆️) y elige 'Añadir a pantalla de inicio'.";

  const note =
    t.tutorial?.steps?.install?.note ||
    t.banner?.showInstallBanner ||
    "";

  const installLabel =
    t.tutorial?.steps?.install?.installButton ||
    t.banner?.install ||
    "Instalar";

  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl border border-[#E6F2F4] shadow-[0_8px_24px_rgba(82,174,185,0.15)] p-4 space-y-3">
      {/* Píldora con icono y título (dentro de la tarjeta blanca) */}
       <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#F1FBFD] flex items-center justify-center text-lg">
          <span aria-hidden>📲</span>
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>

      {/* Caja azul con contenido y título centrado */}
      <div className="bg-[#52AEB9] text-white rounded-3xl shadow p-4">
        <div className="flex items-center justify-center w-full mb-2">
          <h3 className="text-base font-semibold text-white/90 text-center">
            {innerTitle}
          </h3>
        </div>

        <div className="text-center">
          {installed ? (
            <p className="text-sm text-white/90">
              {t.tutorial?.steps?.install?.installed || "La app ya está instalada ✅"}
            </p>
          ) : showInstructionsOnly ? (
            <div className="text-white text-base py-2 px-3 rounded-lg bg-[#00000033] inline-block">
              {safariMsg}
            </div>
          ) : canInstall ? (
            <button
              onClick={promptInstall}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-6 py-2 mt-2 mb-1 text-base transition shadow"
            >
              {installLabel}
            </button>
          ) : (
            <p className="text-sm text-white/90">{safariMsg}</p>
          )}

          {note && <p className="text-xs text-white/80 mt-2">{note}</p>}
        </div>
      </div>
    </div>
  );
}
