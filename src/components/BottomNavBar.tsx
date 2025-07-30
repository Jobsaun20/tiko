import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Plus, BookUser, ScrollText, Trophy, Menu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [othersOpen, setOthersOpen] = useState(false);
  const othersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        othersRef.current &&
        !othersRef.current.contains(event.target as Node)
      ) {
        setOthersOpen(false);
      }
    }
    if (othersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [othersOpen]);

  return (
    <nav
      className="
        fixed bottom-6 left-0 right-0 z-50
        flex justify-center items-end pointer-events-none
      "
    >
      <div
        className="
          pointer-events-auto
          w-full max-w-[340px] mx-5
          bg-white/95
          backdrop-blur-xl
          rounded-2xl
          shadow-[0_8px_40px_0_rgba(70,90,130,0.16)]
          flex justify-between items-center
          px-3 py-2
          border border-white/80
        "
        style={{ minHeight: 54 }}
      >
        <NavButton
          to="/"
          icon={<Home className="w-4 h-4" />}
          label={t.nav?.home || "Startseite"}
          active={location.pathname === "/"}
        />
        <NavButton
          to="/groups"
          icon={<Users className="w-4 h-4" />}
          label={t.nav?.groups || "Gruppen"}
          active={location.pathname === "/groups"}
        />
        {/* Botón central azul, cuadrado, grande */}
        <button
          className="
            flex flex-col items-center justify-center
            transition-transform
            mx-1
            active:scale-95
            shadow-[0_8px_24px_0_rgba(82,174,185,0.18)]
            mt-[-12px]  // <-- AJUSTA AQUÍ LA ALTURA
          "
          style={{ minWidth: 52 }}
          onClick={() => navigate("/fine-modal")}
        >
          <span
            className="
              flex items-center justify-center
              rounded-xl
              bg-[#52AEB9]
              w-[48px] h-[48px]
              transition
            "
          >
            <Plus className="w-7 h-7 text-white" />
          </span>
        </button>
        <NavButton
          to="/contacts"
          icon={<BookUser className="w-4 h-4" />}
          label={t.nav?.contacts || "Kontakte"}
          active={location.pathname === "/contacts"}
        />
        <div className="relative flex flex-col items-center flex-1" ref={othersRef}>
  <NavButton
    to="#"
    icon={<Menu className="w-4 h-4" />}
    label={t.app.other || "Andere"}
    active={othersOpen}
    onClick={() => setOthersOpen((open) => !open)}
    noNavigate
  />
  {othersOpen && (
    <div
      className="
        absolute
        bottom-[68px]   // Un poco más arriba (ajusta según necesites)
        right-[-13px]   // Un poco más a la derecha
        bg-white/100
        border-0
        rounded-xl
        shadow-xl
        flex flex-col
        z-50
        animate-in fade-in slide-in-from-bottom
        py-2
      "
      style={{
        minWidth: 170,
        maxWidth: "calc(100vw - 14px)",
        boxShadow: "0 8px 32px 0 rgb(40 70 110 / 12%)",
      }}
    >
      <DropdownItem
        icon={<ScrollText className="w-4 h-4" />}
        label={t.nav?.fines || "Strafen"}
        onClick={() => {
          navigate("/history");
          setOthersOpen(false);
        }}
        active={location.pathname === "/history"}
      />
      <DropdownItem
        icon={<Trophy className="w-4 h-4" />}
        label={t.challenges?.challenges || "Challenges"}
        onClick={() => {
          navigate("/challenges");
          setOthersOpen(false);
        }}
        active={location.pathname === "/challenges"}
      />
    </div>
  )}
</div>


      </div>
    </nav>
  );
}

// NavButton: icono/texto más pequeño, cloud azul en activo, texto azul en activo
function NavButton({
  to,
  icon,
  label,
  active,
  onClick,
  noNavigate = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  noNavigate?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={
        noNavigate
          ? onClick
          : () => navigate(to)
      }
      className={`
        flex flex-col items-center flex-1
        px-1 py-1
        rounded-xl
        font-medium
        transition-all duration-100
        relative
        ${active ? "font-semibold text-[#52AEB9]" : "text-[#434B56]"}
      `}
      style={{
        minWidth: 42,
      }}
    >
      <span className="relative flex items-center justify-center">
        {active && (
          <span
            className="
              absolute -z-10 left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              bg-[#E6F6F9]
            "
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              opacity: 1,
              boxShadow: "0 2px 8px 0 rgba(69,181,190,0.07)",
            }}
          />
        )}
        <span
          className={`
            flex items-center justify-center
            rounded-full
            ${active ? "" : "bg-[#F3F5F9]"}
            transition
            w-[26px] h-[26px]
          `}
        >
          {/* Color icono */}
          {icon &&
            (typeof icon === "object"
              ? (
                <span
                  className="w-4 h-4 flex items-center justify-center"
                  style={{ color: active ? "#52AEB9" : "#434B56" }}
                >
                  {icon}
                </span>
              )
              : icon)}
        </span>
      </span>
      <span className="text-[11px] mt-1">{label}</span>
    </button>
  );
}

// DropdownItem: icono en círculo gris igual que la barra inferior
function DropdownItem({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-5 py-3
        rounded-xl
        transition hover:bg-[#F3F6FA] w-full text-left
        ${active ? "font-semibold text-[#52AEB9]" : "text-[#434B56]"}
      `}
      style={{
        fontSize: "15px",
        minWidth: 160,
      }}
    >
      <span
        className="
          flex items-center justify-center
          rounded-full
          bg-[#F3F5F9]
          w-[28px] h-[28px]
          mr-1
        "
      >
        {/* Icono pequeño, color gris */}
        {icon &&
          (typeof icon === "object"
            ? (
              <span
                className="w-4 h-4 flex items-center justify-center"
                style={{ color: "#434B56" }}
              >
                {icon}
              </span>
            )
            : icon)}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default BottomNavBar;
