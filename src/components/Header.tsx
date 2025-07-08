import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, User } from "lucide-react";
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
import { useNotifications } from "@/hooks/useNotifications"; // <- Asegúrate de usar el hook que retorna { unreadCount }

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { profile: user } = useUserProfile();
  const { unreadCount } = useNotifications(); // <-- clave, badge de dot rojo

  const handleDeleteAccount = () => {
    // Aquí puedes hacer llamada real a Supabase/borrar cuenta si lo necesitas
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">O</span>
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t.app.name}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{t.app.subtitle}</p>
            </div>
            <div className="xs:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t.app.name}
              </h1>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => navigate("/notifications")}
              aria-label="Notificaciones"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {/* Punto rojo si hay notificaciones sin leer */}
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
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
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
                  {/* Opción "Mi Perfil" eliminada */}
                  <DropdownMenuItem onClick={() => navigate("/notifications")} className="text-sm">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>{t.nav.notifications}</span>
                  </DropdownMenuItem>
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
