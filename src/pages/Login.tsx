import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react"; // Si tienes loader, si no, quita

export default function Login() {
  const { login, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Login Social (Google)
  const handleGoogleLogin = async () => {
    setError(null);
    const { error } = await login(email, password, "google");
    if (error) setError(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await login(email, password);
    if (error) setError(error.message);
    else navigate("/"); // Redirige si login OK
  };

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin w-4 h-4" /> : "Entrar"}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
      {/* Login social: Google */}
      <div className="my-4 text-center">
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            setError(null);
            const { error } = await login(undefined, undefined, "google");
            if (error) setError(error.message);
          }}
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          Iniciar sesión con Google
        </Button>
      </div>
      <div className="text-center text-sm mt-2">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-blue-600 underline">Regístrate</Link>
      </div>
    </div>
    
  );
  
}


