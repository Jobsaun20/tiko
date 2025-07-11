import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

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
    else navigate("/");
  };

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#52AEB9]">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold text-[#52AEB9] text-center mb-4">Log in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#52AEB9] text-white font-bold rounded-xl shadow hover:bg-[#418893] transition"
          >
            {loading ? <Loader className="animate-spin w-4 h-4" /> : "Sign in"}
          </Button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </form>
        <div className="text-center text-sm mt-2 text-black">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-500 font-semibold hover:text-yellow-600 underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
