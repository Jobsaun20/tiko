import { useState, useEffect } from "react";
import { getSupabaseFunctionUrl } from "@/utils/getSupabaseFunctionUrl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { EditProfileModal } from "@/components/EditProfileModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Award, Users, QrCode, TrendingUp, Trophy, Edit, ArrowLeft, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateLevel, getXPProgress, BADGES } from "@/utils/gamification";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/supabaseClient";

const rewards = [
  { icon: "🎯", title: "Precisión", description: "Multas justas y bien fundamentadas" },
  { icon: "🤝", title: "Buen Compañero", description: "Pagos rápidos y sin complicaciones" },
  { icon: "⚡", title: "Velocidad", description: "Respuesta rápida a multas" },
  { icon: "🏆", title: "Liderazgo", description: "Gestión efectiva de grupos" }
];

export default function Profile() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const { profile, loading, error, updateProfile } = useUserProfile();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Si es nuevo, todos los campos vacíos
  const user = profile || {
    name: "",
    email: "",
    avatar_url: "",
    xp: 0,
    level: 1,
    badges: [],
    groups: [],
    achievements: [],
    totalSent: 0,
    totalReceived: 0,
    totalPaid: 0,
    totalEarned: 0,
    twintQR: ""
  };

  const currentLevel = calculateLevel(user.xp);
  const progressToNextLevel = getXPProgress(user.xp);
  const userBadges = BADGES.filter(badge => (user.badges || []).includes(badge.id));

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Guardar perfil
  const handleSaveProfile = async (updatedUser: any) => {
    await updateProfile({
      name: updatedUser.name,
      avatar_url: updatedUser.avatar_url,
      // puedes añadir aquí phone, etc si tu modal lo permite
    });
    toast({ title: "Perfil actualizado" });
    setIsEditProfileOpen(false);
  };

  // Logout real
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Eliminar cuenta real (Edge Function)
  const handleDeleteAccount = async () => {
    if (!profile?.id) return;

    // Obtenemos el access_token de sesión con Supabase v2
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;

   /*  const res = await fetch("https://pyecpkccpfeuittnccat.supabase.co/functions/v1/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token || ""}`,
      },
      body: JSON.stringify({ user_id: profile.id }),
    }); */

    const endpoint = getSupabaseFunctionUrl("delete-user");
const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${access_token || ""}`,
  },
  body: JSON.stringify({ user_id: profile.id }),
});

    if (!res.ok) {
      const result = await res.json().catch(() => null);
      toast({
        title: "Error al eliminar la cuenta",
        description: result?.error || "No se pudo eliminar la cuenta. Contacta con soporte.",
        variant: "destructive",
      });
      return;
    }

    // Logout y feedback
    await logout();
    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta y todos tus datos han sido eliminados correctamente.",
    });
    navigate('/login');
  };

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  if (loading) return <div className="text-center py-16">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

        {/* Volver atrás móvil */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Cabecera de perfil */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {user.username
                    ? user.username
                    : <span>
                        Sin nombre{" "}
                        <span className="text-xs text-blue-600 cursor-pointer underline ml-1"
                              onClick={() => setIsEditProfileOpen(true)}>
                          (Editar perfil)
                        </span>
                      </span>
                  }
                </h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Nivel {currentLevel}
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {user.xp} XP
                  </Badge>
                </div>

                {/* Insignias recientes */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                  {userBadges.slice(0, 2).map((badge) => (
                    <Badge key={badge.id} variant="secondary" className={getRarityColor(badge.rarity)}>
                      {badge.icon} {badge.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex-1 min-w-48 mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{progressToNextLevel.current} XP</span>
                    <span>Nivel {currentLevel + 1}</span>
                  </div>
                  <Progress value={progressToNextLevel.percentage} className="h-2" />
                </div>

                {/* Botón Editar */}
                <Button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones de cuenta */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Cuenta
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/history?filter=sent")}
          >
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-700">{user.totalSent}</p>
              <p className="text-sm text-gray-600">Multas Enviadas</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/history?filter=received")}
          >
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2 transform rotate-180" />
              <p className="text-2xl font-bold text-green-700">{user.totalReceived}</p>
              <p className="text-sm text-gray-600">Multas Recibidas</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/history?filter=paid")}
          >
            <CardContent className="p-4 text-center">
              <span className="text-2xl mb-2 block">💰</span>
              <p className="text-2xl font-bold text-red-700">{user.totalPaid} CHF</p>
              <p className="text-sm text-gray-600">Total Pagado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <span className="text-2xl mb-2 block">💸</span>
              <p className="text-2xl font-bold text-green-700">{user.totalEarned} CHF</p>
              <p className="text-sm text-gray-600">Total Recibido</p>
            </CardContent>
          </Card>
        </div>

        {/* Insignias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Insignias Obtenidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userBadges.map((badge) => (
                <div key={badge.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <Badge variant="secondary" className={getRarityColor(badge.rarity)}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recompensas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recompensas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{reward.icon}</span>
                  <div>
                    <h3 className="font-semibold">{reward.title}</h3>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grupos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mis Grupos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.groups.length > 0 ? user.groups.map((group: any) => (
                <div key={group.id || group.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.members || 1} miembros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={group.role === "admin" ? "default" : "secondary"}>
                      {group.role === "admin" ? "Admin" : "Miembro"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/groups")}
                    >
                      Ver Grupo
                    </Button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500">No tienes grupos aún.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Código QR TWINT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Mi Código TWINT
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="max-w-48 mx-auto mb-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <QrCode className="h-32 w-32 mx-auto text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Comparte este código para que te puedan enviar multas
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/my-qr")}
            >
              Compartir QR
            </Button>
          </CardContent>
        </Card>

        {/* Modal editar perfil */}
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
          onSave={handleSaveProfile}
        />

        {/* Confirmación de borrado */}
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos, 
                multas e historial de la aplicación.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar Cuenta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
