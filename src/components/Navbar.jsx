import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { 
    lang, 
    toggleLanguage, 
    cartCount, 
    setIsCartOpen 
  } = useStore();

  return (
    <div className="fixed top-3 end-3 sm:top-5 sm:end-5 z-50 flex items-center gap-2 pointer-events-auto">
      {/* Language Switcher Icon: Beige background with border */}
      <button
        onClick={toggleLanguage}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d6c4a5] bg-[#f5ede0]/95 backdrop-blur-xs hover:border-[#ba8a24] text-stone-900 flex items-center justify-center text-xs font-bold transition-all cursor-pointer active:scale-95"
        title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
      >
        <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
      </button>

      {/* Shopping Bag Icon: Beige background with border */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#d6c4a5] bg-[#f5ede0]/95 backdrop-blur-xs hover:border-[#ba8a24] text-stone-900 flex items-center justify-center transition-all cursor-pointer active:scale-95"
        title="Bag"
      >
        <ShoppingBag className="w-4 h-4 text-stone-800" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -end-1 bg-[#ba8a24] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
