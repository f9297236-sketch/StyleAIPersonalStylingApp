import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft, MapPin, Navigation, ShoppingBag, Target } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const MOCK_STORES = [
  { id: 1, name: "Zara", address: "123 Fashion Ave", distance: "0.8 mi", x: "60%", y: "40%", items: 2 },
  { id: 2, name: "Urban Outfitters", address: "456 Style St", distance: "1.2 mi", x: "30%", y: "60%", items: 1 },
  { id: 3, name: "Local Boutique 'Kicks'", address: "789 Sneaker Blvd", distance: "2.5 mi", x: "70%", y: "75%", items: 1 },
];

const MOCK_ITEMS = [
  { id: 1, name: "Oversized Hoodie", brand: "Urban Outfitters", price: "$65", storeId: 2 },
  { id: 2, name: "Cargo Pants", brand: "Zara", price: "$49", storeId: 1 },
  { id: 3, name: "Chunky Sneakers", brand: "Local Boutique", price: "$120", storeId: 3 },
  { id: 4, name: "Chain Necklace", brand: "Zara", price: "$15", storeId: 1 }
];

export function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  
  const [showOriginal, setShowOriginal] = useState(false);
  const [activeStore, setActiveStore] = useState<number | null>(null);

  const transformedPhoto = result?.transformedPhoto || "https://images.unsplash.com/photo-1616847220575-31b062a4cd05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjBzdHJlZXR3ZWFyJTIwd29tYW4lMjBmdWxsJTIwYm9keSUyMG91dGZpdHxlbnwxfHx8fDE3ODA5MzI0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const originalPhoto = result?.originalPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjB3b21hbiUyMHBvcnRyYWl0JTIwZnJvbnQlMjBmYWNlfGVufDF8fHx8MTc4MDkzMjQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="flex flex-col h-full bg-stone-50 font-sans relative overflow-hidden">
      
      {/* Full Map Background */}
      <div className="absolute inset-0 bg-stone-200">
        <div className="absolute inset-0 opacity-80 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXB8ZW58MXx8fHwxNzgwOTM0MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center grayscale-[20%]" />
        
        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60" />
        </div>

        {/* Store Pins */}
        {MOCK_STORES.map(store => (
          <button 
            key={store.id}
            onClick={() => setActiveStore(store.id === activeStore ? null : store.id)}
            className="absolute z-10 transform -translate-x-1/2 -translate-y-full transition-all"
            style={{ left: store.x, top: store.y }}
          >
            <div className={`px-3 py-2 rounded-full shadow-md flex items-center gap-1.5 transition-all border ${
              activeStore === store.id ? 'bg-stone-900 text-white scale-110 -translate-y-1 border-stone-800' : 'bg-white text-stone-900 border-stone-200 hover:scale-105'
            }`}>
              <MapPin size={16} className={activeStore === store.id ? 'fill-stone-900 text-white' : 'text-stone-500'} />
              <span className="text-xs font-semibold">{store.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Header / Nav */}
      <div className="absolute top-safe pt-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
        <button 
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-900 shadow-sm border border-stone-200 pointer-events-auto hover:bg-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Generated Look PIP */}
      <div className="absolute top-safe pt-4 right-4 z-20 pointer-events-auto">
        <div className="relative w-24 h-32 bg-white rounded-[1rem] p-1 shadow-lg border border-stone-200 overflow-hidden group">
          <img 
            src={showOriginal ? originalPhoto : transformedPhoto} 
            alt="My Look" 
            className="w-full h-full object-cover rounded-[0.7rem]"
          />
          <button 
             onPointerDown={() => setShowOriginal(true)}
             onPointerUp={() => setShowOriginal(false)}
             onPointerLeave={() => setShowOriginal(false)}
             className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-stone-900/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
           >
             Hold
           </button>
        </div>
      </div>

      {/* Bottom Sheet for Shopping */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pt-4 pb-8 px-6 border-t border-white">
          <div className="w-12 h-1.5 bg-stone-300/50 rounded-full mx-auto mb-6" />
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 tracking-tight">Shop the Look</h2>
              <p className="text-sm text-stone-500">{activeStore ? `At ${MOCK_STORES.find(s => s.id === activeStore)?.name}` : 'Available nearby'}</p>
            </div>
            <button className="bg-stone-100 text-stone-600 p-2.5 rounded-full hover:bg-stone-200 transition-all">
              <Target size={18} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 snap-x -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {MOCK_ITEMS.filter(item => activeStore ? item.storeId === activeStore : true).map(item => {
              const store = MOCK_STORES.find(s => s.id === item.storeId);
              return (
                <div key={item.id} className="min-w-[150px] max-w-[150px] bg-white rounded-3xl p-3 shadow-sm border border-stone-100 snap-start shrink-0 flex flex-col">
                  <div className="w-full aspect-square bg-stone-50 rounded-2xl mb-3 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-stone-400" />
                  </div>
                  <h4 className="font-semibold text-stone-900 text-sm leading-tight mb-1 truncate">{item.name}</h4>
                  <p className="text-xs text-stone-500 mb-3 truncate">{item.brand}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-medium text-stone-900">{item.price}</span>
                    <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                      {store?.distance}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2">
             <button className="w-full bg-stone-900 text-white py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-stone-800 transition-all">
               <Navigation size={18} />
               {activeStore ? `Navigate to ${MOCK_STORES.find(s => s.id === activeStore)?.name}` : 'Navigate to Nearest'}
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}