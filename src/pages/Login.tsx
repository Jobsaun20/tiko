import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react"; // Remove if you don't use Loader

export default function Login() {
  const { login, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await login(email, password);
    if (error) setError(error.message);
    else navigate("/"); // Redirect if login OK
  };

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Log in</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader className="animate-spin w-4 h-4" /> : "Sign in"}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
      <div className="text-center text-sm mt-2">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 underline">Sign up</Link>
      </div>
    </div>
  );
}
