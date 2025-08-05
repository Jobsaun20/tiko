import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import { useAuthContext } from '@/contexts/AuthContext';
import ScrollToTop from "@/components/ScrollToTop"; // <--- Añade esta línea


// Contextos globales
import { BadgeModalProvider } from '@/contexts/BadgeModalContext';
import { PWAInstallProvider } from '@/contexts/PWAInstallContext';
import { InstallBanner } from '@/components/InstallBanner';

// Layout con barra y control de modals globales
import NavBarLayout from '@/layouts/NavBarLayout';

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
import ChallengesPage from "@/pages/Challenges";

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
import ContactsModalPage from "./pages/NewFineModalPage";
import InstallAppIOS from "./pages/InstallAppIOS";

// --- Nuevo Hook ---
import { useSendPendingChallengeFines } from "@/hooks/useSendPendingChallengeFines";

// FUNCION: Decodifica clave VAPID (para PushManager)
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// HOOK: Registra push notifications y guarda la suscripción en Supabase
function usePushNotifications(user: any) {
  useEffect(() => {
    if (!user) return;
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/service-worker.js")
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
  // LOG clave VAPID y objeto suscripción
  console.log("🟢 Subscription registrada:", sub);
  console.log("🟢 Clave VAPID usada:", VAPID_PUBLIC_KEY);
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

      {/* Protegidas - SIEMPRE dentro de NavBarLayout */}
      <Route path="/" element={
  !user ? <Navigate to="/welcome" replace /> : (
    <ProtectedRoute>
      <NavBarLayout>
        <Index />
      </NavBarLayout>
    </ProtectedRoute>
  )
} />
      <Route path="/history" element={
        <ProtectedRoute>
          <NavBarLayout>
            <History />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <NavBarLayout>
            <Profile />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route path="/contacts" element={
        <ProtectedRoute>
          <NavBarLayout>
            <Contacts />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route path="/groups" element={
        <ProtectedRoute>
          <NavBarLayout>
            <Groups />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <NavBarLayout>
            <Settings />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-qr" element={
        <ProtectedRoute>
          <NavBarLayout>
            <MyQR />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NavBarLayout>
            <Notifications />
          </NavBarLayout>
        </ProtectedRoute>
      } />
      <Route
   path="/challenges"
   element={
     <ProtectedRoute>
       <NavBarLayout>
         <ChallengesPage />
       </NavBarLayout>
     </ProtectedRoute>
   }
 />
      <Route path="/fine-modal" element={<ContactsModalPage />} />
      <Route path="/install-ios" element={<InstallAppIOS />} />

      {/* Catch-all */}
      <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/welcome" replace />} />
    </Routes>
  );
}

function App() {
  const { user } = useAuthContext();
  usePushNotifications(user);
  useSendPendingChallengeFines();  // <<--- AQUÍ VA EL NUEVO HOOK

  return (
   <LanguageProvider>
  <PWAInstallProvider>
    <BadgeModalProvider>
      <Router>
        <ScrollToTop /> 
        <div className="App">
          <AppRoutes />
          <InstallBanner />
          <Toaster />
        </div>
      </Router>
    </BadgeModalProvider>
  </PWAInstallProvider>
</LanguageProvider>
  );
}

export default App;
