
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateLevel, getXPProgress } from "@/utils/gamification";
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

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdate?: (userData: any) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export const UserProfile = ({ 
  isOpen, 
  onClose, 
  user, 
  onUserUpdate,
  onLogout,
  onDeleteAccount 
}: UserProfileProps) => {
  const { t } = useLanguage();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const currentLevel = calculateLevel(user?.xp || 0);
  const xpProgress = getXPProgress(user?.xp || 0);

  const handleDeleteAccount = () => {
    onDeleteAccount?.();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t.nav.profile}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Nivel {currentLevel}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {user?.xp || 0} XP
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  // Navigate to profile page
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.nav.logout}
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
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
    </>
  );
};
