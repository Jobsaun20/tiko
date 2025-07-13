import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';

// Contextos globales
import { BadgeModalProvider } from '@/contexts/BadgeModalContext';
import { PWAInstallProvider } from '@/contexts/PWAInstallContext';
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

// Páginas legales
import AGBPage from '@/pages/legal/agb';
import DatenschutzPage from './pages/legal/datenschutz';
import HaftungsausschlussPage from '@/pages/legal/haftungsausschluss';
import ImpressumPage from "./pages/legal/impressum";

// Tutorial/Onboarding y bienvenida
import Welcome from '@/pages/Welcome';
import Onboarding from '@/pages/Onboarding';

// Supabase client
import { supabase } from "@/supabaseClient";

// FUNCION: Decodifica clave VAPID (para PushManager)
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// HOOK: Registra push notifications y guarda la suscripción en Supabase
function usePushNotifications(user) {
  useEffect(() => {
    if (!user) return;
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

// AppRoutes con todas tus rutas y protección
function AppRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <Routes>
      {/* Onboarding/Bienvenida solo sin login */}
      <Route path="/welcome" element={!user ? <Welcome /> : <Navigate to="/" replace />} />
      <Route path="/onboarding" element={!user ? <Onboarding /> : <Navigate to="/register" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      {/* Legales */}
      <Route path="/legal/agb" element={<AGBPage />} />
      <Route path="/legal/datenschutz" element={<DatenschutzPage />} />
      <Route path="/legal/haftungsausschluss" element={<HaftungsausschlussPage />} />
      <Route path="/legal/impressum" element={<ImpressumPage />} />

      {/* Protegidas */}
      <Route path="/" element={user ? (
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      ) : <Navigate to="/welcome" replace />} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/my-qr" element={<ProtectedRoute><MyQR /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
    </Routes>
  );
}

function App() {
  const { user } = useAuthContext();
  usePushNotifications(user);

  return (
    <LanguageProvider>
      <PWAInstallProvider>
        <Router>
          <BadgeModalProvider>
            <div className="App">
              <AppRoutes />
              <InstallBanner />
              <Toaster />
            </div>
          </BadgeModalProvider>
        </Router>
      </PWAInstallProvider>
    </LanguageProvider>
  );
}

export default App;
