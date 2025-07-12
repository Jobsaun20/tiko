import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';

// CONTEXTO GLOBAL DE LOGROS (MODAL BADGES)
import { BadgeModalProvider } from '@/contexts/BadgeModalContext';

// CONTEXTO GLOBAL PARA INSTALAR PWA
import { PWAInstallProvider } from '@/contexts/PWAInstallContext';

// Banner para instalar la app (PWA)
import { InstallBanner } from '@/components/InstallBanner';

// Páginas principales
import Index from '@/pages/Index';
import History from '@/pages/History';
import Profile from '@/pages/Profile';
import Contacts from '@/pages/Contacts';
import Groups from '@/pages/Groups';
import Settings from '@/pages/Settings';
import MyQR from '@/pages/MyQR';
import Notifications from '@/pages/Notifications';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Páginas legales públicas
import AGBPage from '@/pages/legal/agb';
import DatenschutzPage from './pages/legal/datenschutz';
import HaftungsausschlussPage from '@/pages/legal/haftungsausschluss';
import ImpressumPage from "./pages/legal/impressum";

// Tutorial/Onboarding y Bienvenida
import Welcome from '@/pages/Welcome';
import Onboarding from '@/pages/Onboarding';

// Importa tu cliente de Supabase
import { supabase } from "@/supabaseClient"; // ajusta la ruta si es distinta

// FUNCION AUXILIAR PARA DECODIFICAR LA CLAVE VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// HOOK para registrar push notifications y guardar la suscripción en Supabase
function usePushNotifications(user) {
  useEffect(() => {
    if (!user) return; // Espera a que haya usuario logueado

    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker registrado:", reg.scope))
        .catch((err) => console.error("Error registrando SW:", err));

      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          (async () => {
            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
              sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
              });
            }
            // Guarda la suscripción en Supabase
            await supabase
              .from("push_subscriptions")
              .upsert({ user_id: user.id, subscription: sub.toJSON() });
          })();
        } else {
          console.warn("Permiso de notificaciones denegado");
        }
      });
    }
  }, [user]);
}

function AppRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <Routes>
      {/* Tutorial y Bienvenida: solo si NO está logueado */}
      <Route path="/welcome" element={!user ? <Welcome /> : <Navigate to="/" replace />} />
      <Route path="/onboarding" element={!user ? <Onboarding /> : <Navigate to="/register" replace />} />

      {/* Páginas públicas de login y registro */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      {/* Páginas legales públicas */}
      <Route path="/legal/agb" element={<AGBPage />} />
      <Route path="/legal/datenschutz" element={<DatenschutzPage />} />
      <Route path="/legal/haftungsausschluss" element={<HaftungsausschlussPage />} />
      <Route path="/legal/impressum" element={<ImpressumPage />} />

      {/* Páginas protegidas */}
      <Route
        path="/"
        element={
          user
            ? (
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              )
            : <Navigate to="/welcome" replace />
        }
      />
      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/contacts" element={
        <ProtectedRoute>
          <Contacts />
        </ProtectedRoute>
      } />
      <Route path="/groups" element={
        <ProtectedRoute>
          <Groups />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/my-qr" element={
        <ProtectedRoute>
          <MyQR />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />

      {/* Redirección catch-all: igual que raíz */}
      <Route
        path="*"
        element={
          user
            ? <Navigate to="/" replace />
            : <Navigate to="/welcome" replace />
        }
      />
    </Routes>
  );
}

function App() {
  const { user } = useAuthContext();
  usePushNotifications(user); // <-- Activa el hook aquí

  return (
    <LanguageProvider>
      <PWAInstallProvider>
        <Router>
          <BadgeModalProvider>
            <div className="App">
              <AppRoutes />
              <InstallBanner /> {/* Banner para instalar PWA */}
              <Toaster />
            </div>
          </BadgeModalProvider>
        </Router>
      </PWAInstallProvider>
    </LanguageProvider>
  );
}

export default App;
