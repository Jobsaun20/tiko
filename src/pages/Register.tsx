import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { LanguageSelector } from "@/components/LanguageSelector"; // <-- Importa el selector

export default function Register() {
  const { register, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<"checking" | "ok" | "taken" | "">("");
  const [error, setError] = useState<string | null>(null);

  // 🔵 Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Check if username is unique in real time
  useEffect(() => {
    let active = true;
    if (!username) {
      setUsernameStatus("");
      return;
    }
    setUsernameStatus("checking");
    const checkUsername = setTimeout(async () => {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("username", username.trim())
        .maybeSingle();
      if (!active) return;
      if (data) setUsernameStatus("taken");
      else setUsernameStatus("ok");
    }, 400);
    return () => {
      active = false;
      clearTimeout(checkUsername);
    };
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("You must choose a username.");
      return;
    }
    if (usernameStatus === "taken") {
      setError("This username is already taken.");
      return;
    }
    if (usernameStatus !== "ok") {
      setError("Please wait for your username to be validated.");
      return;
    }

    // 1. Register user in Auth
    const { error: regError } = await register(email, password);
    if (regError) {
      setError(regError.message);
      return;
    }

    // 2. Wait for the user to be available (up to 10 attempts/2 seconds)
    let tries = 0;
    let currentUser = user;
    while (!currentUser && tries < 10) {
      await new Promise(r => setTimeout(r, 200));
      const res = await supabase.auth.getUser();
      currentUser = res.data.user;
      tries++;
    }

    if (!currentUser) {
      setError("User profile could not be created.");
      return;
    }

    // 3. Create empty profile in users table if it does NOT exist
    const { data: existingProfile } = await supabase
      .from("users")
      .select("id")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("users").insert([{
        id: currentUser.id,
        email: currentUser.email,
        username: username.trim(),
        name: "",
        avatar_url: "",
        level: 1,
        xp: 0,
        badges: [],
        groups: [],
        achievements: [],
        // any other initial fields
      }]);
      if (insertError) {
        if (insertError.code === "23505") {
          setError("This username is already taken. Please choose another one.");
        } else {
          setError("Error creating profile: " + insertError.message);
        }
        return;
      }
    }

    // 4. Redirect to Home (optional, because useEffect will handle it)
    // navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#52AEB9] relative">
      {/* Selector de idioma en la esquina superior derecha */}
      <div className="absolute top-5 right-5 z-50">
        <LanguageSelector />
      </div>
      <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold text-[#52AEB9] text-center mb-4">Create account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value.replace(/\s/g, ""))}
            required
            autoComplete="username"
            maxLength={32}
          />
          {username && (
            <div className="text-xs pl-1 pb-1 h-4">
              {usernameStatus === "checking" && (
                <span className="text-gray-500">Checking availability…</span>
              )}
              {usernameStatus === "ok" && (
                <span className="text-green-600">Username available!</span>
              )}
              {usernameStatus === "taken" && (
                <span className="text-red-600">This username is already taken.</span>
              )}
            </div>
          )}
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
            autoComplete="new-password"
            required
          />
          <Button
            type="submit"
            disabled={loading || usernameStatus !== "ok"}
            className="w-full bg-[#52AEB9] text-white font-bold rounded-xl shadow hover:bg-[#418893] transition"
          >
            {loading ? <Loader className="animate-spin w-4 h-4" /> : "Sign up"}
          </Button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </form>
        {/* LEGAL NOTICE WHEN CREATING AN ACCOUNT */}
        <div className="text-xs text-gray-600 mt-4 text-center px-2 leading-tight">
          By creating an account, you automatically accept our{" "}
          <Link to="/legal/agb" className="text-yellow-500 hover:text-yellow-600 underline" target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </Link>
          ,{" "}
          <Link to="/legal/datenschutz" className="text-yellow-500 hover:text-yellow-600 underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          {" "}and{" "}
          <Link to="/legal/haftungsausschluss" className="text-yellow-500 hover:text-yellow-600 underline" target="_blank" rel="noopener noreferrer">
            Disclaimer
          </Link>
          .
        </div>
        <div className="text-center text-sm mt-2 text-black">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 font-semibold hover:text-yellow-600 underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
