import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

const STYLES = [
  { id: "streetwear", name: "Streetwear", img: "https://images.unsplash.com/photo-1595271444083-08084c6857c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBmYXNoaW9uJTIwbmVvbnxlbnwxfHx8fDE3ODA5MzI0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "cottagecore", name: "Cottagecore", img: "https://images.unsplash.com/photo-1635865421288-0e01b4755f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlY29yZSUyMGZhc2hpb24lMjBhZXN0aGV0aWN8ZW58MXx8fHwxNzgwOTMyNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "oldmoney", name: "Old Money", img: "https://images.unsplash.com/photo-1657214005798-86b35114fc0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBtb25leSUyMGFlc3RoZXRpYyUyMGZhc2hpb258ZW58MXx8fHwxNzgwOTMyNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: "darkacademia", name: "Dark Academia", img: "https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYXJrJTIwQWNhZGVtaWElMjBmYXNoaW9ufGVufDF8fHx8MTc4MDkzMzA0MXww&ixlib=rb-4.1.0&q=80&w=1080" },
];

export function StyleSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const photo = location.state?.photo;
  
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [customStyle, setCustomStyle] = useState("");

  const handleGenerate = () => {
    navigate("/processing", { state: { photo, style: selectedStyle, customStyle } });
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 p-6 pb-32 font-sans">
      <div className="flex-1">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white shadow-sm border border-stone-200 rounded-full flex items-center justify-center text-stone-600 mb-8 hover:bg-stone-50 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-2xl font-semibold tracking-tight mb-2 text-stone-900">Choose your vibe</h2>
        <p className="text-stone-500 mb-8">Select a preset theme or write your own.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {STYLES.map((style) => (
            <motion.button
              whileTap={{ scale: 0.97 }}
              key={style.id}
              onClick={() => {
                setSelectedStyle(style.id);
                setCustomStyle("");
              }}
              className={`relative aspect-[3/4] rounded-[2rem] overflow-hidden transition-all flex flex-col ${
                selectedStyle === style.id 
                  ? "ring-2 ring-stone-900 ring-offset-2 ring-offset-stone-50" 
                  : "hover:opacity-90"
              }`}
            >
              <img src={style.img} alt={style.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <p className="text-white font-medium text-sm">{style.name}</p>
              </div>
              
              {selectedStyle === style.id && (
                <div className="absolute top-4 right-4 bg-white text-stone-900 rounded-full p-1.5 shadow-sm">
                   <Check size={14} strokeWidth={3} />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-2">Custom Vibe</label>
          <input
            type="text"
            placeholder='e.g. "90s grunge"'
            value={customStyle}
            onChange={(e) => {
              setCustomStyle(e.target.value);
              setSelectedStyle(null);
            }}
            className="w-full bg-white border border-stone-200 rounded-2xl p-4 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent max-w-md mx-auto z-10">
        <button
          onClick={handleGenerate}
          disabled={!selectedStyle && !customStyle.trim()}
          className={`w-full py-4 rounded-full font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-sm ${
            (selectedStyle || customStyle.trim())
              ? "bg-stone-900 text-white hover:bg-stone-800 hover:shadow-md" 
              : "bg-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          <Sparkles size={20} className={selectedStyle || customStyle.trim() ? "text-stone-300" : "text-stone-400"} />
          Generate Outfit
        </button>
      </div>
    </div>
  );
}