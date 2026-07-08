import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ee37a11a/history`, {
      headers: { "Authorization": `Bearer ${publicAnonKey}` }
    })
    .then(res => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data.success && data.history) {
        const sorted = data.history.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setHistory(sorted);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Failed to load history:", err);
      setError(true);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-stone-50 pb-6">
      <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-stone-200 flex items-center gap-3">
        <button 
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-stone-900">Your Styles</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-40 text-stone-400 gap-2">
            <p className="font-medium text-stone-600">Service temporarily unavailable</p>
            <p className="text-sm text-center">History can't be loaded right now. Try again in a moment.</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-stone-500">
            <p>No saved styles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {history.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={item.id}
                onClick={() => navigate("/results", { state: { result: item } })}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition-shadow relative"
              >
                <div className="aspect-[3/4] bg-stone-200 relative">
                  <img 
                    src={item.transformedPhoto} 
                    alt={item.style} 
                    className="w-full h-full object-cover"
                  />
                  {item.saved && (
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-500" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-stone-900 text-sm truncate capitalize">
                    {item.style || "Custom Style"}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
