import { createBrowserRouter, Outlet, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { UserCircle, LogOut } from "lucide-react";
import { Home } from "./pages/Home";
import { StyleSelect } from "./pages/StyleSelect";
import { Processing } from "./pages/Processing";
import { Results } from "./pages/Results";
import { History } from "./pages/History";
import { Login } from "./pages/Login";
import { supabase } from "./client";

const AnimatedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isLoginRoute = location.pathname === "/login";
  const isResultsRoute = location.pathname === "/results";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col items-center">
      {!isLoginRoute && !isResultsRoute && (
        <header className="w-full max-w-md p-5 flex items-center justify-between bg-stone-50 sticky top-0 z-20">
          <h1 className="text-xl font-semibold tracking-tight cursor-pointer flex items-center gap-2 text-stone-900" onClick={() => navigate("/")}>
            <span className="text-xl">✨</span> StyleAI
          </h1>
          <div>
            {user ? (
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button 
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 text-sm font-medium bg-white text-stone-900 px-4 py-2 rounded-full shadow-sm border border-stone-200 hover:bg-stone-50 transition-all"
              >
                <UserCircle size={18} />
                Sign In
              </button>
            )}
          </div>
        </header>
      )}
      <main className={`w-full max-w-md flex-1 relative overflow-hidden ${(!isLoginRoute && !isResultsRoute) ? "min-h-[calc(100vh-76px)]" : "min-h-screen"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full absolute inset-0 overflow-y-auto overflow-x-hidden"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AnimatedLayout,
    children: [
      { index: true, Component: Home },
      { path: "style", Component: StyleSelect },
      { path: "processing", Component: Processing },
      { path: "results", Component: Results },
      { path: "history", Component: History },
      { path: "login", Component: Login },
    ],
  },
]);