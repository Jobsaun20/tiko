import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Plus, BookUser, ScrollText } from "lucide-react";

export function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-between items-center px-1 py-1 shadow-lg">
      {/* Home */}
      <NavButton
        to="/"
        icon={<Home className="w-6 h-6" />}
        label="Home"
        active={location.pathname === "/"}
      />
      {/* Grupos */}
      <NavButton
        to="/groups"
        icon={<Users className="w-6 h-6" />}
        label="Grupos"
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
        label="Contactos"
        active={location.pathname === "/contacts"}
      />
      {/* Multas/Historial */}
      <NavButton
        to="/history"
        icon={<ScrollText className="w-6 h-6" />}
        label="Multas"
        active={location.pathname === "/history"}
      />
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

export default BottomNavBar;
