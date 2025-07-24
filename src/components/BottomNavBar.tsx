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

  // Cerrar el menú si haces click fuera
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-between items-center px-1 py-1 shadow-lg">
      {/* Home */}
      <NavButton
        to="/"
        icon={<Home className="w-6 h-6" />}
        label={t.nav?.home || "Home"}
        active={location.pathname === "/"}
      />
      {/* Grupos */}
      <NavButton
        to="/groups"
        icon={<Users className="w-6 h-6" />}
        label={t.nav?.groups || "Groups"}
        active={location.pathname === "/groups"}
      />
      {/* Botón +, azul, grande, central */}
      <button
        className="relative z-20 flex flex-col items-center justify-center"
        style={{
          marginTop: "-24px", // para que sobresalga por encima
        }}
        onClick={() => navigate("/fine-modal")}
      >
        <span className="flex items-center justify-center rounded-full border-4 border-white bg-[#52AEB9] shadow-xl"
          style={{ width: 64, height: 64 }}>
          <Plus className="w-10 h-10 text-white" />
        </span>
        <span className="text-xs mt-1 font-bold text-[#52AEB9]"></span>
      </button>
      {/* Contactos */}
      <NavButton
        to="/contacts"
        icon={<BookUser className="w-6 h-6" />}
        label={t.nav?.contacts || "Contacts"}
        active={location.pathname === "/contacts"}
      />
      {/* Others Dropdown */}
      <div className="relative flex-1 flex flex-col items-center" ref={othersRef}>
        <button
          className={`flex flex-col items-center justify-center transition-all w-full py-1 ${
            othersOpen ? "font-bold text-[#52AEB9]" : "text-gray-700"
          }`}
          style={{ minWidth: "60px" }}
          onClick={() => setOthersOpen((open) => !open)}
        >
          <Menu className="w-6 h-6 mb-0.5" />
          <span className="text-xs">{t.app.other}</span>
        </button>
        {othersOpen && (
          <div
            className="absolute bottom-[60px] right-0 w-40 sm:w-36 bg-white border rounded-xl shadow-xl flex flex-col z-50 animate-fade-in-up"
            style={{ minWidth: 140 }}
          >
            <DropdownItem
              icon={<ScrollText className="w-5 h-5" />}
              label={t.nav?.fines || "Fines"}
              onClick={() => {
                navigate("/history");
                setOthersOpen(false);
              }}
              active={location.pathname === "/history"}
            />
            <DropdownItem
              icon={<Trophy className="w-5 h-5" />}
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
    </nav>
  );
}

// Botón individual
function NavButton({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`flex flex-col items-center flex-1 transition-all ${
        active ? "font-bold text-[#52AEB9]" : "text-gray-700"
      } py-1`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}

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
      className={`flex items-center gap-2 px-4 py-3 text-sm transition hover:bg-[#F2F6F9] w-full text-left ${
        active ? "font-bold text-[#52AEB9]" : "text-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default BottomNavBar;
