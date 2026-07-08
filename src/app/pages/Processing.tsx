import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Scan, Search, Shirt, Check } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

function getMockResult(style: string) {
  return {
    id: `mock-${Date.now()}`,
    style,
    createdAt: new Date().toISOString(),
    transformedPhoto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    items: [
      { name: "Linen Blazer", brand: "Zara", price: "$89", category: "Tops" },
      { name: "High-Rise Trousers", brand: "& Other Stories", price: "$75", category: "Bottoms" },
      { name: "Leather Loafers", brand: "Mango", price: "$110", category: "Shoes" },
      { name: "Silk Camisole", brand: "COS", price: "$55", category: "Tops" },
    ],
    stores: [
      { name: "Zara", distance: "0.3 mi", lat: 40.7589, lng: -73.9851 },
      { name: "& Other Stories", distance: "0.5 mi", lat: 40.7614, lng: -73.9776 },
      { name: "COS", distance: "0.7 mi", lat: 40.7549, lng: -73.9840 },
    ],
  };
}

const STEPS = [
  { icon: Scan, text: "Analyzing body shape" },
  { icon: Sparkles, text: "Applying chosen theme" },
  { icon: Shirt, text: "Generating realistic outfit" },
  { icon: Search, text: "Finding matching stores" },
];

export function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const { photo, style, customStyle } = location.state || {};
    
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-ee37a11a/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ photo, style, customStyle })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data.success) {
        setResult(data.result);
      } else {
        setResult(getMockResult(style || customStyle || "casual"));
      }
    })
    .catch(err => {
      console.error("Failed to generate:", err);
      setResult(getMockResult(style || customStyle || "casual"));
    });
  }, [location.state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep >= STEPS.length - 1 && result) {
      setTimeout(() => {
        navigate("/results", { state: { result } });
      }, 1000);
    }
  }, [currentStep, result, navigate]);

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 bg-stone-900 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-stone-900/90 to-stone-900" />
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center">
        <div className="relative w-24 h-24 mb-16 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-white/20"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-16px] rounded-full border border-white/10"
          />
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Sparkles className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="w-full space-y-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isDone = index < currentStep;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isActive || isDone ? 1 : 0.4, y: 0 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isActive ? "bg-white/10 backdrop-blur-md shadow-sm border border-white/5" : "bg-transparent"
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isDone ? "bg-stone-100 text-stone-900" :
                  isActive ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-stone-500"
                }`}>
                  {isDone ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "animate-pulse" : ""} />
                  )}
                </div>
                <p className={`font-medium text-sm tracking-wide ${isActive ? "text-white" : isDone ? "text-stone-300" : "text-stone-500"}`}>
                  {step.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}