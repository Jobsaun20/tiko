
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuth }: AuthModalProps) => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: t.common.error,
        description: t.auth.errors.emailRequired,
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: t.common.error,
        description: t.auth.errors.invalidEmail,
        variant: "destructive"
      });
      return;
    }

    if (!formData.password) {
      toast({
        title: t.common.error,
        description: t.auth.errors.passwordRequired,
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: t.common.error,
        description: t.auth.errors.weakPassword,
        variant: "destructive"
      });
      return;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        toast({
          title: t.common.error,
          description: t.auth.errors.emailRequired,
          variant: "destructive"
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t.common.error,
          description: t.auth.errors.passwordMatch,
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        id: "1",
        email: formData.email,
        name: isLogin ? "Usuario Demo" : formData.fullName
      };
      
      onAuth(user);
      toast({
        title: t.common.success,
        description: isLogin ? t.auth.loginSuccess : t.auth.registerSuccess,
      });
      
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: ""
      });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: ""
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isLogin ? t.auth.login : t.auth.register}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? `${t.auth.hasAccount} ${t.auth.signIn}`
              : `${t.auth.noAccount} ${t.auth.signUp}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">
              {isLogin ? t.auth.login : t.auth.register}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.auth.fullName} {t.common.required}
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t.auth.email} {t.common.required}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t.auth.password} {t.common.required}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {t.auth.confirmPassword} {t.common.required}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t.common.loading : (isLogin ? t.auth.loginButton : t.auth.registerButton)}
              </Button>

              {isLogin && (
                <Button variant="link" className="w-full text-sm">
                  {t.auth.forgotPassword}
                </Button>
              )}

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? t.auth.noAccount : t.auth.hasAccount}
                </p>
                <Button 
                  variant="link" 
                  onClick={toggleMode}
                  className="text-sm font-medium"
                  disabled={isLoading}
                >
                  {isLogin ? t.auth.signUp : t.auth.signIn}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
