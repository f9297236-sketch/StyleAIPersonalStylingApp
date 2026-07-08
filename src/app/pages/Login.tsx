import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Github, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../client";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleProviderSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      }
    });
    
    if (error) {
      console.error("Auth error:", error);
      alert(`Error signing in with ${provider}: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 p-6 items-center justify-center relative font-sans">
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-10 h-10 bg-white shadow-sm border border-stone-200 rounded-full flex items-center justify-center text-stone-600 z-10 hover:bg-stone-50 transition-all"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-stone-50 flex items-center justify-center rounded-full mx-auto mb-6">
            <Sparkles size={24} className="text-stone-900" />
          </div>
          <h1 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-stone-500 text-sm">Sign in to save your looks.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleProviderSignIn('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 text-stone-700 py-3.5 px-4 rounded-2xl font-medium shadow-sm hover:bg-stone-50 transition-all disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleProviderSignIn('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-stone-900 border border-stone-900 text-white py-3.5 px-4 rounded-2xl font-medium shadow-sm hover:bg-stone-800 transition-all disabled:opacity-50"
          >
            <Github size={20} />
            Continue with GitHub
          </button>
        </div>
      </motion.div>
    </div>
  );
}