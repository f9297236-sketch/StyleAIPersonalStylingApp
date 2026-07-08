import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Upload, Camera, ArrowRight, UserCircle, History } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ee37a11a/history`, {
      headers: { "Authorization": `Bearer ${publicAnonKey}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.history) {
        setHistoryCount(data.history.length);
      }
    })
    .catch(err => console.error("Failed to load history:", err));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleMockUpload = () => {
    setPhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwZnJvbnQlMjBmYWNlfGVufDF8fHx8MTc4MDkzMjQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral");
  };

  const handleContinue = () => {
    if (photo) {
      navigate("/style", { state: { photo } });
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 p-6 pb-28 font-sans">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-stone-900 tracking-tight">New Look</h2>
          {historyCount > 0 && (
            <button 
              onClick={() => navigate("/history")}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              <History size={16} />
              History
            </button>
          )}
        </div>
        <p className="text-stone-500 mb-8">Upload a photo to see yourself transformed.</p>

        <div className="bg-white border border-stone-200 shadow-sm rounded-[2rem] p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
          {photo ? (
            <div className="absolute inset-0 w-full h-full">
              <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-stone-900/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                 <button 
                   onClick={() => setPhoto(null)}
                   className="bg-white/90 backdrop-blur-md text-stone-900 px-6 py-3 rounded-full font-medium shadow-sm hover:scale-105 transition-all"
                 >
                   Retake Photo
                 </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 mb-6">
                <UserCircle size={32} />
              </div>
              <p className="font-semibold text-stone-900 text-lg mb-2">Who are you?</p>
              <p className="text-sm text-stone-500 text-center mb-8 max-w-[220px]">Need a full body photo with good lighting</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-stone-900 text-white rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center gap-2 font-medium hover:bg-stone-800 transition-all shadow-sm"
                >
                  <Upload size={20} />
                  Upload
                </button>
                <button 
                  onClick={handleMockUpload}
                  className="flex-1 bg-stone-100 text-stone-700 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center gap-2 font-medium hover:bg-stone-200 transition-all"
                >
                  <Camera size={20} />
                  Demo
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/*" 
              />
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent max-w-md mx-auto z-10">
        <button
          onClick={handleContinue}
          disabled={!photo}
          className={`w-full py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-all shadow-sm ${
            photo 
              ? "bg-stone-900 text-white hover:bg-stone-800 hover:shadow-md" 
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          Choose Theme
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}