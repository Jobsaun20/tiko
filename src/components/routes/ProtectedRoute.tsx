import { useAuthContext } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Cargando...</div>; // Aquí podrías poner tu spinner si tienes uno

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
