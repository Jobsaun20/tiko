import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "./UserProfile";
import { InviteModal } from "@/components/InviteModal";
import { LogOut, User, Share2, Bell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { usePWAInstall } from "@/contexts/PWAInstallContext";
import { calculateLevel } from "@/utils/gamification";
import { supabase } from "@/supabaseClient";

// Traducir nombre de la página actual
const getPageTitle = (pathname, t) => {
  if (pathname.startsWith("/groups")) return t.nav.groups || "Grupos";
  if (pathname.startsWith("/contacts")) return t.nav.contacts || "Contactos";
  if (pathname.startsWith("/history")) return t.nav.history || "Historial";
  if (pathname.startsWith("/challenges")) return t.nav.challenges || "Retos";
  if (pathname.startsWith("/fines")) return t.nav.fines || "Multas";
  if (pathname.startsWith("/profile")) return t.nav.profile || "Perfil";
  if (pathname.startsWith("/settings")) return t.nav.settings || "Ajustes";
  return "";
};

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInviteOpen, setInviteOpen] = useState(false);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();
  const { profile: user } = useUserProfile();
  const { unreadCount } = useNotifications();
  const { canInstall, promptInstall } = usePWAInstall();

  // Actualiza idioma en la BD si cambia
  const lastLang = useRef(null);
  useEffect(() => {
    if (!user || !language) return;
    if (lastLang.current !== language) {
      supabase
        .from("users")
        .update({ language })
        .eq("id", user.id)
        .then(({ error }) => {
          if (!error) lastLang.current = language;
        });
    }
  }, [user, language]);

  const isIndexPage = location.pathname === "/" || location.pathname === "/index";
  const pageTitle = getPageTitle(location.pathname, t);
  const currentLevel = calculateLevel(user?.xp || 0);

  // ========================== HEADER DE INDEX ==========================
  if (isIndexPage) {
    return (
      <header className="w-full bg-[#72bfc4] shadow-md sticky top-0 z-50 rounded-b-2xl">
        <div className="max-w-full mx-auto px-4 py-4 flex items-center justify-between">
          {/* Saludo a la izquierda */}
          <div>
            <div className="flex items-center mb-0.5">
              <span className="font-bold text-white text-xl">
                {t.index?.hola || "Hola"}, {user?.username || ""} <span className="inline-block ml-1">👋</span>
              </span>
            </div>
            <span className="text-white text-base opacity-90">
              {t.index?.subtitle || "Let's start learning!"}
            </span>
          </div>
          {/* Avatar a la derecha, puntito rojo si hay notificaciones */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative focus:outline-none">
                  <Avatar className="h-10 w-10 ring-2 ring-white/40 shadow">
                    <AvatarImage src={user.avatar_url} alt={user.username || user.email || "U"} />
                    <AvatarFallback className="bg-white/40 text-white font-bold">
                      {user.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Puntito rojo fuera del avatar */}
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"
                     
                    ></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Botón notificaciones */}
                <DropdownMenuItem onClick={() => navigate("/notifications")} className="text-sm flex items-center gap-2">
                  <Bell className=" h-4 w-4" />
                  <span>{t.nav.notifications || "Notificaciones"}</span>
                  {unreadCount > 0 && (
<span
    className="ml-auto h-3 w-3 rounded-full bg-red-500 inline-block"
    aria-label="Tienes notificaciones no leídas"
  ></span>                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")} className="text-sm">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t.nav.profile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setInviteOpen(true)}
                  className="text-sm hover:bg-blue-50 flex items-center gap-2"
                >
                  <Share2 className=" h-4 w-4" />
                  <span>{t.share?.title || "Compartir app"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/install-ios")}
                  className="text-sm hover:bg-blue-50 flex items-center gap-2"
                >
                  <span role="img" aria-label="iOS">📲</span>
                  <span>{t.app.installApp}</span>
                </DropdownMenuItem>
                {canInstall && (
                  <DropdownMenuItem
                    onClick={promptInstall}
                    className="text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <span role="img" aria-label="Instalar">📲</span>
                    <span>{t.app.installApp}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 text-sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.nav.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <InviteModal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />
      </header>
    );
  }

  // ===================== HEADER PARA EL RESTO DE PÁGINAS =====================
  return (
    <header className="w-full bg-[#72bfc4] shadow-md border-b sticky top-0 z-50 rounded-b-2xl">
      <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
        {/* Izquierda: nombre, nivel, página */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-0.5">
            <span className="font-bold text-white text-lg">
              {user?.username || ""}
            </span>            
          </div>
          <span className=" px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500 text-white" style={{ marginTop: 1 }}>
              {t.index?.level || "Level"} {currentLevel}
            </span>
          {/* <span className="text-white text-sm opacity-80" style={{ marginLeft: 2 }}>
            {pageTitle}
          </span> */}
        </div>
        {/* Derecha: avatar + menú (puntito si hay notis) */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative focus:outline-none">
                <Avatar className="h-10 w-10 ring-2 ring-white/40 shadow">
                  <AvatarImage src={user.avatar_url} alt={user.username || user.email || "U"} />
                  <AvatarFallback className="bg-white/40 text-white font-bold">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"
                    aria-label={`${unreadCount} notificaciones no leídas`}
                  ></span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => navigate("/notifications")} className="text-sm flex items-center gap-2">
                  <Bell className=" h-4 w-4" />
                  <span>{t.nav.notifications || "Notificaciones"}</span>
                  {unreadCount > 0 && (
<span
    className="ml-auto h-3 w-3 rounded-full bg-red-500 inline-block"
    aria-label="Tienes notificaciones no leídas"
  ></span>                  )}
                </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")} className="text-sm">
                <User className="mr-2 h-4 w-4" />
                <span>{t.nav.profile}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setInviteOpen(true)}
                className="text-sm hover:bg-blue-50 flex items-center gap-2"
              >
                <Share2 className=" h-4 w-4" />
                <span>{t.share?.title || "Compartir app"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/install-ios")}
                className="text-sm hover:bg-blue-50 flex items-center gap-2"
              >
                <span role="img" aria-label="iOS">📲</span>
                <span>{t.app.installApp}</span>
              </DropdownMenuItem>
              {canInstall && (
                <DropdownMenuItem
                  onClick={promptInstall}
                  className="text-sm font-semibold text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                >
                  <span role="img" aria-label="Instalar">📲</span>
                  <span>{t.app.installApp}</span>
                </DropdownMenuItem>
                
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.nav.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <InviteModal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />
    </header>
  );
};
