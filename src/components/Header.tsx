import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "./UserProfile";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNotifications } from "@/hooks/useNotifications";

// 👇 Importa el hook de instalación PWA
import { usePWAInstall } from "@/contexts/PWAInstallContext";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { profile: user } = useUserProfile();
  const { unreadCount } = useNotifications();

  // Hook para la instalación de la PWA
  const { canInstall, promptInstall } = usePWAInstall();

  const handleDeleteAccount = () => {
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-full mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Nombre */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img
              src="/img/logosvg.svg"
              alt="Logo"
              className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg object-contain bg-white"
              style={{ background: "transparent" }}
            />
            {/* Nombre para móvil */}
            <h1
              className="ml-2 text-lg font-bold block sm:hidden"
              style={{ color: "#52AEB9" }}
            >
              {t.app.name}
            </h1>
            {/* Nombre y subtítulo solo en sm+ */}
            <div className="hidden sm:flex flex-col ml-3">
              <h1
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#52AEB9" }}
              >
                {t.app.name}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{t.app.subtitle}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 sm:h-12 sm:w-12"
              onClick={() => navigate("/notifications")}
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"
                  aria-label={`${unreadCount} notificaciones no leídas`}
                />
              )}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={user.avatar_url} alt={user.username || user.email || "U"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm">
                        {user.username?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
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
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/notifications")} className="text-sm">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>{t.nav.notifications}</span>
                  </DropdownMenuItem>
                  {/* --- Botón Instalar App SOLO si es instalable --- */}
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
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="ml-2"
              >
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </div>
      {user && (
        <UserProfile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
    </header>
  );
};
