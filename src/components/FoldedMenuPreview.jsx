import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, UtensilsCrossed } from 'lucide-react';

export default function FoldedMenuPreview({ storeData, lang, t }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const products = storeData.products || [];
  const half = Math.ceil(Math.min(products.length, 8) / 2);
  const firstHalf = products.slice(0, half);
  const secondHalf = products.slice(half, 8);

  return (
    <div className="w-full my-8 sm:my-16 px-3 flex justify-center">
      {!isOpen ? (
        /* ===================== FOLDED MENU (مستطيل أمامي + مستطيل خلفي مائل بلون أغمق) ===================== */
        <div
          onClick={() => setIsOpen(true)}
          className="relative group cursor-pointer select-none py-2 px-3"
        >
          {/* 1. Back tilted rectangle (المستطيل المائل باللون الأغمق - إيحاء الطية الواقعية) */}
          <div 
            className={`absolute inset-0 w-64 sm:w-72 h-[460px] sm:h-[520px] rounded-3xl border border-[#c5b294] bg-[#e4d8c3] transition-all duration-500 ease-out shadow-lg pointer-events-none ${
              lang === 'ar' 
                ? '-rotate-4 -translate-x-3 sm:-translate-x-4.5 translate-y-2 group-hover:-rotate-6 group-hover:-translate-x-6' 
                : 'rotate-4 translate-x-3 sm:translate-x-4.5 translate-y-2 group-hover:rotate-6 group-hover:translate-x-6'
            }`}
          >
            {/* Inner fold shadow gradient on the back leaf */}
            <div className={`absolute top-0 bottom-0 w-12 pointer-events-none bg-linear-to-r ${
              lang === 'ar' ? 'end-0 from-transparent to-[#1c1917]/10' : 'start-0 from-[#1c1917]/10 to-transparent'
            }`} />
          </div>

          {/* 2. Third subtle intermediate shadow flap for added 3D paper realism */}
          <div 
            className={`absolute inset-0 w-64 sm:w-72 h-[460px] sm:h-[520px] rounded-3xl border border-[#cfbeab] bg-[#ebe0ce] transition-all duration-500 ease-out pointer-events-none ${
              lang === 'ar' 
                ? '-rotate-2 -translate-x-1.5 translate-y-1 group-hover:-rotate-3 group-hover:-translate-x-3' 
                : 'rotate-2 translate-x-1.5 translate-y-1 group-hover:rotate-3 group-hover:translate-x-3'
            }`}
          />

          {/* 3. Front rectangle (المستطيل الأمامي باللون الفاتح النظيف) */}
          <div className="relative z-10 w-64 sm:w-72 h-[460px] sm:h-[520px] rounded-3xl border border-[#d6c4a5] bg-[#f5ede0] group-hover:border-[#ba8a24] transition-all duration-300 flex flex-col items-center justify-center p-6 shadow-md active:scale-[0.98]">
            
            {/* Fold spine shadow along the folded edge */}
            <div className={`absolute top-0 bottom-0 w-8 pointer-events-none bg-linear-to-r ${
              lang === 'ar' ? 'end-0 from-transparent to-[#1c1917]/5' : 'start-0 from-[#1c1917]/5 to-transparent'
            }`} />

            {/* Logo */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-[#d6c4a5] bg-[#ede3d2] p-1 mb-6 transition-transform duration-300 group-hover:scale-105">
              <img
                src={storeData.hero?.logoUrl || '/images/logo.png'}
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            {/* Word "Menu / منيو" only */}
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-widest uppercase">
              {lang === 'ar' ? 'منيو' : 'Menu'}
            </h3>
          </div>
        </div>
      ) : (
        /* ===================== SIMPLIFIED OPEN MENU: HALF DARK & HALF LIGHT (نصف غامق ونصف فاتح) ===================== */
        <div className="w-full max-w-4xl rounded-3xl border border-[#d6c4a5] bg-[#ede3d2] overflow-hidden transition-all duration-500 animate-in fade-in zoom-in-95 shadow-2xl">
          
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 bg-[#e8ded0] border-b border-[#d6c4a5]">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-wide">
              {lang === 'ar' ? 'منيو' : 'Menu'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full border border-[#d6c4a5] bg-[#f5ede0] hover:border-stone-900 text-stone-700 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bi-fold two halves: One half darker (#e5d9c7) & one half lighter (#f5ede0) */}
          <div className="grid grid-cols-1 md:grid-cols-2 relative">
            
            {/* Center Fold Crease (Spine between the two halves) */}
            <div className="hidden md:block absolute top-0 bottom-0 start-1/2 w-px -translate-x-1/2 bg-[#cfbeab] z-20" />
            <div className="hidden md:block absolute top-0 bottom-0 start-1/2 w-10 -translate-x-1/2 bg-linear-to-r from-[#1c1917]/6 via-transparent to-[#1c1917]/6 pointer-events-none z-10" />

            {/* LEFT / FIRST HALF: Darker Beige Side (النصف باللون الأغمق لايحاء ظل الطية) */}
            <div className="bg-[#e8ded0] p-4 sm:p-6 md:p-7 border-b md:border-b-0 border-[#d6c4a5] space-y-3">
              {firstHalf.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/menu')}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-[#cfbeab] bg-[#f0e7d8]/90 hover:bg-[#f5ede0] hover:border-stone-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.titleEn}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-[#c5b294] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {lang === 'ar' ? item.titleAr : item.titleEn}
                      </h4>
                      <p className="text-[11px] text-stone-600 font-light mt-0.5">
                        {lang === 'ar' ? 'أقل كمية للطلب:' : 'Min Order:'} {item.minQuantity} {lang === 'ar' ? item.unitAr : item.unitEn}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* RIGHT / SECOND HALF: Lighter Beige Side (النصف باللون الفاتح لايحاء الضوء الخارجي) */}
            <div className="bg-[#f5ede0] p-4 sm:p-6 md:p-7 space-y-3">
              {secondHalf.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/menu')}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-[#d6c4a5] bg-[#ede3d2]/60 hover:bg-[#ede3d2] hover:border-stone-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.titleEn}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-[#d6c4a5] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {lang === 'ar' ? item.titleAr : item.titleEn}
                      </h4>
                      <p className="text-[11px] text-stone-600 font-light mt-0.5">
                        {lang === 'ar' ? 'أقل كمية للطلب:' : 'Min Order:'} {item.minQuantity} {lang === 'ar' ? item.unitAr : item.unitEn}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="px-5 sm:px-8 py-4 bg-[#e8ded0] border-t border-[#d6c4a5] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-stone-600 hover:text-stone-900 font-light cursor-pointer"
            >
              {lang === 'ar' ? 'طي ورقة المينيو' : 'Close Menu'}
            </button>

            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 text-[#f5ede0] hover:bg-stone-800 text-xs font-bold transition-colors cursor-pointer active:scale-95"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#ba8a24]" />
              <span>{lang === 'ar' ? 'تصفح المينيو كاملاً (Explore)' : 'Explore Full Menu'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
