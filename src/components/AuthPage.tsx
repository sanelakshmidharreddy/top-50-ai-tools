import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Mail, Lock, ArrowRight, Loader2, UserPlus, LogIn } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err: any) {
      console.error(err.code);
      switch (err.code) {
        case 'auth/invalid-email':
          setError("Invalid email address format.");
          break;
        case 'auth/user-not-found':
          setError("User not found. Please check your email or sign up.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/email-already-in-use':
          setError("This email is already registered. Please login instead.");
          break;
        case 'auth/weak-password':
          setError("Password should be at least 6 characters.");
          break;
        case 'auth/invalid-credential':
          setError("Invalid email or password.");
          break;
        case 'auth/unauthorized-domain':
          setError("This domain is not authorized in Firebase. Please add it to 'Authorized domains' in Firebase Console.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-8">
      <div
        className="w-full max-w-md bg-brand-card border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {isLogin ? <Lock className="text-brand-accent w-8 h-8" /> : <UserPlus className="text-brand-accent w-8 h-8" />}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-medium">
            {isLogin ? "Login to access your AI Handbook" : "Sign up to start your AI journey"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm mb-8 font-medium flex items-center space-x-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all focus:ring-4 focus:ring-brand-accent/10 text-base"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-brand-accent outline-none transition-all focus:ring-4 focus:ring-brand-accent/10 text-base"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent hover:bg-blue-600 text-white py-4 sm:py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>{isLogin ? "Login Now" : "Sign Up Now"}</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-gray-400 hover:text-brand-accent transition-colors flex items-center justify-center mx-auto space-x-2"
          >
            {isLogin ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Don't have an account? Sign Up</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Already have an account? Login</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center mt-10 text-xs sm:text-sm text-gray-500 font-medium italic">
          Secure access to your premium AI content.
        </p>
      </div>
    </div>
  );
}
