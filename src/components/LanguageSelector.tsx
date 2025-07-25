import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

const languages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' },
];

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuthContext(); // <-- Obtiene el usuario logueado
  const currentLanguage = languages.find(lang => lang.code === language);

  const handleChangeLanguage = async (lang: Language) => {
    setLanguage(lang);
    if (user?.id) {
      // Actualiza el idioma en la base de datos del usuario
      await supabase
        .from("users")
        .update({ language: lang })
        .eq("id", user.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 text-xl">
          <span>{currentLanguage?.flag || "🌐"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChangeLanguage(lang.code)}
            className={`flex items-center gap-2 ${language === lang.code ? 'bg-purple-50' : ''}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
