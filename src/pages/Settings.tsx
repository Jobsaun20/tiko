
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, ArrowLeft, Globe, Bell, Shield, Info, Moon, Sun } from "lucide-react";
import { Header } from "@/components/Header";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const mockUser = {
  id: "1",
  name: "Usuario Demo",
  email: "user@example.com",
  avatar: "/placeholder.svg",
  xp: 150,
  totalSent: 5,
  totalPaid: 3,
  fastPayments: 2,
  adminGroups: 1,
  totalContacts: 15,
  pendingFines: 1,
  totalReceived: 4,
  totalEarned: 75,
  badges: ['first-fine', 'early-payer']
};

export default function Settings() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user] = useState(mockUser);
  const [settings, setSettings] = useState({
    notifications: {
      newFines: true,
      payments: true,
      reminders: false,
      achievements: true
    },
    privacy: {
      showProfile: true,
      allowInvites: true,
      showStats: false
    },
    appearance: {
      darkMode: false
    }
  });

  const handleNotificationToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
    toast({
      title: "Configuración actualizada",
      description: "Los cambios han sido guardados correctamente.",
    });
  };

  const handlePrivacyToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key as keyof typeof prev.privacy]
      }
    }));
    toast({
      title: "Configuración actualizada",
      description: "Los cambios han sido guardados correctamente.",
    });
  };

  const handleAppearanceToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: !prev.appearance[key as keyof typeof prev.appearance]
      }
    }));
    toast({
      title: "Configuración actualizada",
      description: "Los cambios han sido guardados correctamente.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header user={user} />
      
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Back Button for mobile */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            {t.pages.settings.title}
          </h1>
          <p className="text-gray-600">{t.pages.settings.description}</p>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t.pages.settings.language}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Idioma de la aplicación</Label>
                  <p className="text-sm text-gray-600">Selecciona tu idioma preferido</p>
                </div>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.pages.settings.notifications}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nuevas multas</Label>
                  <p className="text-sm text-gray-600">Recibir notificaciones de multas nuevas</p>
                </div>
                <Switch
                  checked={settings.notifications.newFines}
                  onCheckedChange={() => handleNotificationToggle('newFines')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Pagos</Label>
                  <p className="text-sm text-gray-600">Notificaciones de pagos recibidos</p>
                </div>
                <Switch
                  checked={settings.notifications.payments}
                  onCheckedChange={() => handleNotificationToggle('payments')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recordatorios</Label>
                  <p className="text-sm text-gray-600">Recordatorios de multas pendientes</p>
                </div>
                <Switch
                  checked={settings.notifications.reminders}
                  onCheckedChange={() => handleNotificationToggle('reminders')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logros</Label>
                  <p className="text-sm text-gray-600">Notificaciones de nuevos logros e insignias</p>
                </div>
                <Switch
                  checked={settings.notifications.achievements}
                  onCheckedChange={() => handleNotificationToggle('achievements')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.pages.settings.privacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Perfil público</Label>
                  <p className="text-sm text-gray-600">Permitir que otros vean tu perfil</p>
                </div>
                <Switch
                  checked={settings.privacy.showProfile}
                  onCheckedChange={() => handlePrivacyToggle('showProfile')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recibir invitaciones</Label>
                  <p className="text-sm text-gray-600">Permitir invitaciones a grupos</p>
                </div>
                <Switch
                  checked={settings.privacy.allowInvites}
                  onCheckedChange={() => handlePrivacyToggle('allowInvites')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Estadísticas públicas</Label>
                  <p className="text-sm text-gray-600">Mostrar estadísticas en el perfil público</p>
                </div>
                <Switch
                  checked={settings.privacy.showStats}
                  onCheckedChange={() => handlePrivacyToggle('showStats')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settings.appearance.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo oscuro</Label>
                  <p className="text-sm text-gray-600">Usar tema oscuro (próximamente)</p>
                </div>
                <Switch
                  checked={settings.appearance.darkMode}
                  onCheckedChange={() => handleAppearanceToggle('darkMode')}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t.pages.settings.about}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Versión:</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última actualización:</span>
                <span className="text-sm font-medium">Enero 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Desarrollado por:</span>
                <span className="text-sm font-medium">Oopsie Team</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
